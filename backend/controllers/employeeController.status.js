/**
 * Employee status update utilities
 * 
 * These functions should be integrated into employeeController.js
 * after the database migration has been applied
 */

const supabase = require('../utils/supabaseClient');
const blockchainService = require('../utils/blockchainService');

// Update an employee's status
const updateEmployeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        const hrId = req.hrUser.id;

        // Validate status value
        const validStatuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED', 'SUSPENDED'];
        if (!status || !validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({ 
                error: 'Invalid status value', 
                valid_values: validStatuses 
            });
        }

        // Check if employee exists
        const { data: employee, error: employeeError } = await supabase
            .from('employees')
            .select('id, name, email, status')
            .eq('id', id)
            .single();

        if (employeeError || !employee) {
            console.error('❌ Error fetching employee:', employeeError);
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Don't update if status hasn't changed
        if (employee.status === status.toUpperCase()) {
            return res.status(200).json({
                message: `Employee already has status: ${status.toUpperCase()}`,
                employee
            });
        }

        // Record status change in history table
        try {
            await supabase
                .from('employee_status_history')
                .insert({
                    employee_id: id,
                    previous_status: employee.status,
                    new_status: status.toUpperCase(),
                    changed_by: hrId,
                    reason: reason || null
                });
        } catch (historyError) {
            console.warn('Failed to record status history, continuing with update:', historyError);
        }

        // Update employee status in database
        const { data: updatedEmployee, error: updateError } = await supabase
            .from('employees')
            .update({
                status: status.toUpperCase()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('❌ Error updating employee status:', updateError);
            return res.status(500).json({ error: 'Failed to update employee status' });
        }

        console.log(`✅ Employee ${employee.name} status updated from ${employee.status} to ${status.toUpperCase()}`);

        // Record ALL status changes on blockchain automatically
        let blockchainTxHash = null;
        try {
            // Check if employee exists on blockchain
            const blockchainStatus = await blockchainService.checkEmployeeExistsOnBlockchain(id);
            
            if (blockchainStatus.exists) {
                // Update status on blockchain
                const blockchainResult = await blockchainService.updateEmployeeStatus(
                    id, 
                    status.toUpperCase(),
                    reason || 'Status update by HR'
                );
                
                if (blockchainResult.success) {
                    blockchainTxHash = blockchainResult.txHash;
                    console.log(`✅ Employee status change recorded on blockchain: ${blockchainTxHash}`);
                } else {
                    console.error('❌ Blockchain recording failed:', blockchainResult.reason);
                }
            } else {
                console.warn(`⚠️ Employee ${id} does not exist on blockchain yet. Status change recorded in database only.`);
            }
        } catch (blockchainError) {
            console.error('❌ Blockchain recording failed, but status updated in database:', blockchainError);
        }
        
        // Return the updated employee data
        delete updatedEmployee.password; // Don't send password back
        
        res.json({
            message: `Employee status successfully updated to ${status.toUpperCase()}`,
            employee: updatedEmployee,
            blockchain_transaction: blockchainTxHash
        });
    } catch (error) {
        console.error('❌ Error in updateEmployeeStatus:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Helper function to get valid next statuses based on current status
const getValidStatusTransitions = (currentStatus) => {
    const transitions = {
        'ACTIVE': ['INACTIVE', 'ON_LEAVE', 'TERMINATED', 'SUSPENDED'],
        'INACTIVE': ['ACTIVE', 'TERMINATED'],
        'ON_LEAVE': ['ACTIVE', 'TERMINATED'],
        'SUSPENDED': ['ACTIVE', 'TERMINATED'],
        'TERMINATED': [] // Terminal state
    };
    
    return transitions[currentStatus] || [];
};

// Export functions to be integrated
module.exports = {
    updateEmployeeStatus,
    getValidStatusTransitions
}; 