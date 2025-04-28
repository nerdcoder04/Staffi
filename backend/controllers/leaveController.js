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
        employees(wallet)
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

    return res.status(200).json({
      message: 'Leave request approved successfully and recorded on blockchain',
      leave: data,
      blockchain_tx: blockchainResult.txHash
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