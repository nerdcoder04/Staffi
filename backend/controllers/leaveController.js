const supabase = require('../utils/supabaseClient');
const logger = require('../utils/logger');
const blockchainService = require('../utils/blockchainService');

/**
 * Apply for leave
 * @route POST /api/leave/apply
 */
exports.applyForLeave = async (req, res) => {
  try {
    const { reason, days, startDate } = req.body;
    const empId = req.user.id;

    // Validate request
    if (!reason || !days || !startDate) {
      return res.status(400).json({ error: 'Reason, days, and start date are required' });
    }

    if (days <= 0) {
      return res.status(400).json({ error: 'Number of days must be greater than 0' });
    }

    // Insert leave request into database
    const { data, error } = await supabase
      .from('leaves')
      .insert({
        emp_id: empId,
        reason,
        days,
        start_date: startDate,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) {
      logger.error('Error applying for leave:', error);
      return res.status(500).json({ error: 'Failed to apply for leave' });
    }

    return res.status(201).json({
      message: 'Leave application submitted successfully',
      leave: data
    });
  } catch (error) {
    logger.error('Error in leave application:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get leaves for the authenticated employee
 * @route GET /api/leave/my-leaves
 */
exports.getMyLeaves = async (req, res) => {
  try {
    const empId = req.user.id;

    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .eq('emp_id', empId)
      .order('submitted_at', { ascending: false });

    if (error) {
      logger.error('Error fetching leaves:', error);
      return res.status(500).json({ error: 'Failed to fetch leaves' });
    }

    return res.status(200).json({ leaves: data });
  } catch (error) {
    logger.error('Error in fetching leaves:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all leave requests (HR only)
 * @route GET /api/leave/all
 */
exports.getAllLeaves = async (req, res) => {
  try {
    const { status, department } = req.query;
    
    // Start building the base query
    let query = supabase
      .from('leaves')
      .select(`
        *,
        employees(name, email, role_id, department_id)
      `);
    
    if (status) {
      query = query.eq('status', status.toUpperCase());
    }
    
    // When filtering by department, we need to join with employees first
    // and then filter the results to only include matches
    const { data, error } = await query.order('submitted_at', { ascending: false });

    if (error) {
      logger.error('Error fetching all leaves:', error);
      return res.status(500).json({ error: 'Failed to fetch leaves' });
    }

    // Apply department filter after getting the results
    let filteredData = data;
    if (department) {
      filteredData = data.filter(leave => 
        leave.employees && leave.employees.department_id === parseInt(department)
      );
    }

    return res.status(200).json({ leaves: filteredData });
  } catch (error) {
    logger.error('Error in fetching all leaves:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Approve a leave request (HR only)
 * @route POST /api/leave/:id/approve
 */
exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    
    // The HR user data is already available from authMiddleware
    const hrId = req.hrUser.id;

    // Get leave details to verify it exists and is pending
    const { data: leave, error: leaveError } = await supabase
      .from('leaves')
      .select(`
        *,
        employees(id, name, email, status, wallet)
      `)
      .eq('id', id)
      .single();

    if (leaveError || !leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'PENDING') {
      return res.status(400).json({ error: 'Leave request is already processed' });
    }

    // Check blockchain availability
    const blockchainAvailable = await blockchainService.isBlockchainAvailable();
    if (!blockchainAvailable && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        error: 'Blockchain service unavailable. Leave not approved.', 
        details: 'Contact administrator to ensure proper blockchain configuration.'
      });
    }

    // Check if employee exists on blockchain
    const employeeCheck = await blockchainService.checkEmployeeExistsOnBlockchain(leave.emp_id);
    if (!employeeCheck.exists && process.env.NODE_ENV !== 'test') {
      return res.status(400).json({ 
        error: 'Employee not found on blockchain.', 
        details: 'This employee must be added to the blockchain first. Please contact HR to resolve this issue.'
      });
    }

    // Record leave approval on blockchain
    const blockchainResult = await blockchainService.recordLeaveApproval(
      leave.emp_id,
      leave.days,
      leave.reason
    );

    if (!blockchainResult.success && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        error: 'Blockchain transaction failed. Leave not approved.', 
        details: blockchainResult.reason 
      });
    }
    
    // Only update database if blockchain operation succeeded or we're in test mode
    const { data, error } = await supabase
      .from('leaves')
      .update({
        status: 'APPROVED',
        approved_by: hrId,
        approved_at: new Date(),
        blockchain_tx: blockchainResult.txHash // Store the transaction hash
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error approving leave in database:', error);
      
      if (blockchainResult.txHash) {
        return res.status(500).json({ 
          error: 'Blockchain transaction succeeded but database update failed', 
          blockchain_tx: blockchainResult.txHash 
        });
      } else {
        return res.status(500).json({ error: 'Failed to approve leave in database' });
      }
    }

    // Change employee status to ON_LEAVE
    let statusUpdateResult = null;
    let statusUpdateError = null;
    const previousStatus = leave.employees.status || 'ACTIVE';
    
    try {
      // Update employee status in database
      const { data: updatedEmployee, error: statusError } = await supabase
        .from('employees')
        .update({
          status: 'ON_LEAVE'
        })
        .eq('id', leave.emp_id)
        .select()
        .single();
      
      if (statusError) {
        logger.error('Error updating employee status to ON_LEAVE:', statusError);
        statusUpdateError = 'Failed to update employee status in database';
      } else {
        // Record status change in history
        const { error: historyError } = await supabase
          .from('employee_status_history')
          .insert({
            employee_id: leave.emp_id,
            previous_status: previousStatus,
            new_status: 'ON_LEAVE',
            changed_by: hrId,
            reason: `Leave approved: ${leave.reason}`
          });
        
        if (historyError) {
          logger.error('Error recording status history:', historyError);
        }
        
        // Update status on blockchain
        const statusBlockchainResult = await blockchainService.updateEmployeeStatus(
          leave.emp_id,
          'ON_LEAVE',
          `Leave approved: ${leave.reason}`
        );
        
        if (statusBlockchainResult.success) {
          // Update the status history record with the transaction hash
          await supabase
            .from('employee_status_history')
            .update({ blockchain_tx: statusBlockchainResult.txHash })
            .eq('employee_id', leave.emp_id)
            .is('blockchain_tx', null)
            .order('created_at', { ascending: false })
            .limit(1);
          
          statusUpdateResult = {
            success: true,
            transaction: statusBlockchainResult.txHash
          };
        } else {
          logger.error('Error updating employee status on blockchain:', statusBlockchainResult.reason);
          statusUpdateResult = {
            success: false,
            reason: statusBlockchainResult.reason
          };
        }
      }
    } catch (statusUpdateErr) {
      logger.error('Error in status update process:', statusUpdateErr);
      statusUpdateError = 'Unexpected error during status update';
    }

    return res.status(200).json({
      message: 'Leave request approved successfully and recorded on blockchain',
      leave: data,
      blockchain_tx: blockchainResult.txHash,
      status_update: {
        success: statusUpdateResult ? statusUpdateResult.success : false,
        error: statusUpdateError,
        transaction: statusUpdateResult ? statusUpdateResult.transaction : null
      }
    });
  } catch (error) {
    logger.error('Error in approving leave:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Reject a leave request (HR only)
 * @route POST /api/leave/:id/reject
 */
exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    // The HR user data is already available from authMiddleware
    const hrId = req.hrUser.id;

    if (!rejectionReason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    // Get leave details to verify it exists and is pending
    const { data: leave, error: leaveError } = await supabase
      .from('leaves')
      .select('*')
      .eq('id', id)
      .single();

    if (leaveError || !leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'PENDING') {
      return res.status(400).json({ error: 'Leave request is already processed' });
    }

    // Update the leave status in the database
    const { data, error } = await supabase
      .from('leaves')
      .update({
        status: 'REJECTED',
        rejected_by: hrId,
        rejected_at: new Date(),
        rejection_reason: rejectionReason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error rejecting leave:', error);
      return res.status(500).json({ error: 'Failed to reject leave' });
    }

    return res.status(200).json({
      message: 'Leave request rejected successfully',
      leave: data
    });
  } catch (error) {
    logger.error('Error in rejecting leave:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Mark an employee as returned from leave (HR only)
 * @route POST /api/leave/:id/return
 */
exports.returnFromLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    
    // The HR user data is already available from authMiddleware
    const hrId = req.hrUser.id;

    // Get leave details to verify it exists and was approved
    const { data: leave, error: leaveError } = await supabase
      .from('leaves')
      .select(`
        *,
        employees(id, name, email, status, wallet)
      `)
      .eq('id', id)
      .single();

    if (leaveError || !leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Only approved leaves can be marked as returned' });
    }
    
    if (leave.employees.status !== 'ON_LEAVE') {
      return res.status(400).json({ error: 'Employee is not currently on leave' });
    }

    // Update the leave status in the database
    const { data, error } = await supabase
      .from('leaves')
      .update({
        status: 'COMPLETED',
        return_date: new Date(),
        return_comments: comments || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating leave to completed:', error);
      return res.status(500).json({ error: 'Failed to mark leave as completed' });
    }

    // Change employee status back to ACTIVE
    let statusUpdateResult = null;
    let statusUpdateError = null;
    
    try {
      // Update employee status in database
      const { data: updatedEmployee, error: statusError } = await supabase
        .from('employees')
        .update({
          status: 'ACTIVE'
        })
        .eq('id', leave.emp_id)
        .select()
        .single();
      
      if (statusError) {
        logger.error('Error updating employee status to ACTIVE:', statusError);
        statusUpdateError = 'Failed to update employee status in database';
      } else {
        // Record status change in history
        const { error: historyError } = await supabase
          .from('employee_status_history')
          .insert({
            employee_id: leave.emp_id,
            previous_status: 'ON_LEAVE',
            new_status: 'ACTIVE',
            changed_by: hrId,
            reason: `Returned from leave: ${comments || 'Leave period completed'}`
          });
        
        if (historyError) {
          logger.error('Error recording status history:', historyError);
        }
        
        // Update status on blockchain
        const statusBlockchainResult = await blockchainService.updateEmployeeStatus(
          leave.emp_id,
          'ACTIVE',
          `Returned from leave: ${comments || 'Leave period completed'}`
        );
        
        if (statusBlockchainResult.success) {
          // Update the status history record with the transaction hash
          await supabase
            .from('employee_status_history')
            .update({ blockchain_tx: statusBlockchainResult.txHash })
            .eq('employee_id', leave.emp_id)
            .is('blockchain_tx', null)
            .order('created_at', { ascending: false })
            .limit(1);
          
          statusUpdateResult = {
            success: true,
            transaction: statusBlockchainResult.txHash
          };
        } else {
          logger.error('Error updating employee status on blockchain:', statusBlockchainResult.reason);
          statusUpdateResult = {
            success: false,
            reason: statusBlockchainResult.reason
          };
        }
      }
    } catch (statusUpdateErr) {
      logger.error('Error in status update process:', statusUpdateErr);
      statusUpdateError = 'Unexpected error during status update';
    }

    return res.status(200).json({
      message: 'Employee marked as returned from leave successfully',
      leave: data,
      status_update: {
        success: statusUpdateResult ? statusUpdateResult.success : false,
        error: statusUpdateError,
        transaction: statusUpdateResult ? statusUpdateResult.transaction : null
      }
    });
  } catch (error) {
    logger.error('Error in marking return from leave:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}; 