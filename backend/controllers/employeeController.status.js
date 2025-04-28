/**
 * Employee status update utilities
 * 
 * These functions should be integrated into employeeController.js
 * after the database migration has been applied
 */

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

        // Record status change in history table (create this table if you need an audit trail)
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

        // Update employee status
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

        // Record on blockchain if integrated
        if (status.toUpperCase() === 'TERMINATED' || status.toUpperCase() === 'SUSPENDED') {
            try {
                // If blockchain integration is available for status changes
                if (blockchainService && typeof blockchainService.updateEmployeeStatus === 'function') {
                    const blockchainResult = await blockchainService.updateEmployeeStatus(
                        id, 
                        status.toUpperCase(),
                        reason || 'Status update by HR'
                    );
                    
                    console.log(`✅ Employee status change recorded on blockchain: ${blockchainResult.txHash || 'N/A'}`);
                }
            } catch (blockchainError) {
                console.error('❌ Blockchain recording failed, but status updated in database:', blockchainError);
            }
        }
        
        // Return the updated employee data
        delete updatedEmployee.password; // Don't send password back
        
        res.json({
            message: `Employee status successfully updated to ${status.toUpperCase()}`,
            employee: updatedEmployee
        });
    } catch (error) {
        console.error('❌ Error in updateEmployeeStatus:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Request a leave of absence (sets status to ON_LEAVE)
const requestLeaveOfAbsence = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const employeeId = req.employee.id;

        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ error: 'Start date, end date, and reason are required' });
        }

        // Calculate total days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the end day

        if (diffDays <= 0 || start > end) {
            return res.status(400).json({ error: 'Invalid date range' });
        }

        // Create leave request in the leaves table
        const { data: leaveRequest, error: leaveError } = await supabase
            .from('leaves')
            .insert({
                emp_id: employeeId,
                reason: reason,
                days: diffDays,
                start_date: startDate,
                end_date: endDate,
                status: 'PENDING'
            })
            .select()
            .single();

        if (leaveError) {
            console.error('❌ Error creating leave request:', leaveError);
            return res.status(500).json({ error: 'Failed to create leave request' });
        }

        console.log(`✅ Leave request created for employee ID ${employeeId} for ${diffDays} days`);

        res.status(201).json({
            message: 'Leave request submitted successfully',
            leave_request: leaveRequest
        });
    } catch (error) {
        console.error('❌ Error in requestLeaveOfAbsence:', error);
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
    requestLeaveOfAbsence,
    getValidStatusTransitions
}; 