/**
 * Employee status routes
 * These routes handle employee status changes and leave requests
 */

const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const { authenticateHR, authenticateEmployee } = require('../middleware/authMiddleware');
const { 
    updateEmployeeStatus, 
    getValidStatusTransitions
} = require('../controllers/employeeController.status');
const employeeController = require('../controllers/employeeController');

// HR routes for managing employee statuses
router.put('/:id/status', authenticateHR, updateEmployeeStatus);

// Get valid status transitions
router.get('/status/transitions/:currentStatus', (req, res) => {
    const { currentStatus } = req.params;
    if (!currentStatus) {
        return res.status(400).json({ error: 'Current status is required' });
    }
    
    const validTransitions = getValidStatusTransitions(currentStatus.toUpperCase());
    
    res.json({
        current_status: currentStatus.toUpperCase(),
        valid_transitions: validTransitions
    });
});

// Get employee status history
router.get('/:id/status-history', authenticateHR, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if employee exists
        const { data: employee, error: employeeError } = await supabase
            .from('employees')
            .select('id, name')
            .eq('id', id)
            .single();

        if (employeeError || !employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        // Get status history
        const { data: history, error: historyError } = await supabase
            .from('employee_status_history_view')
            .select('*')
            .eq('employee_id', id)
            .order('created_at', { ascending: false });

        if (historyError) {
            console.error('Error fetching status history:', historyError);
            return res.status(500).json({ error: 'Failed to fetch status history' });
        }
        
        res.json({
            employee_id: id,
            employee_name: employee.name,
            status_history: history
        });
    } catch (error) {
        console.error('Error in status history endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 