/**
 * Payroll Controller
 * Handles payroll transaction endpoints and blockchain integration
 */

const logger = require('../utils/logger');
const payrollService = require('../services/payrollService');
const supabase = require('../services/supabaseService');

/**
 * Send payroll transaction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendPayroll = async (req, res) => {
  try {
    const { employee_id, amount } = req.body;

    // Validate required fields
    if (!employee_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing employee_id parameter'
      });
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount parameter. Must be a positive number'
      });
    }

    // Check if employee exists
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id, name, email')
      .eq('id', employee_id)
      .single();

    if (employeeError || !employee) {
      logger.error('Employee not found:', employeeError);
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    // Log transaction on blockchain
    const blockchainResult = await payrollService.logPayrollTransaction(
      employee_id,
      parseFloat(amount)
    );

    if (!blockchainResult.success) {
      return res.status(500).json({
        success: false,
        error: `Blockchain transaction failed: ${blockchainResult.reason}`
      });
    }

    // Save record to database
    const dbResult = await payrollService.savePayrollRecord(
      employee_id,
      parseFloat(amount),
      blockchainResult.txHash
    );

    if (!dbResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save payroll record to database',
        details: dbResult.error
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Payroll transaction recorded successfully',
      data: {
        employee_id,
        amount: parseFloat(amount),
        transaction_hash: blockchainResult.txHash,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error in sendPayroll:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get employee payroll history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmployeePayrolls = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id, name, email')
      .eq('id', id)
      .single();

    if (employeeError || !employee) {
      logger.error('Employee not found:', employeeError);
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    // Get payroll history
    const result = await payrollService.getEmployeePayrollHistory(id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch payroll history',
        details: result.error
      });
    }

    // Return payroll records
    return res.status(200).json({
      success: true,
      data: result.data,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email
      }
    });
  } catch (error) {
    logger.error('Error in getEmployeePayrolls:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get current employee's payroll history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMyPayrolls = async (req, res) => {
  try {
    const employeeId = req.user.id;

    // Get payroll history
    const result = await payrollService.getEmployeePayrollHistory(employeeId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch payroll history',
        details: result.error
      });
    }

    // Return payroll records
    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    logger.error('Error in getMyPayrolls:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all payroll records with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPayrolls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100'
      });
    }

    // Get all payroll records
    const result = await payrollService.getAllPayrollRecords(page, limit);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch payroll records',
        details: result.error
      });
    }

    // Return payroll records
    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Error in getAllPayrolls:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  sendPayroll,
  getEmployeePayrolls,
  getMyPayrolls,
  getAllPayrolls
}; 