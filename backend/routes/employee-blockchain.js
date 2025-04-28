/**
 * Routes for blockchain-related employee operations
 */

const express = require('express');
const router = express.Router();
const { verifyEmployeeOnBlockchain, attachBlockchainStatus } = require('../middleware/blockchain-check');
const { ethers } = require('ethers');
const employeeArtifact = require('../../contracts/artifacts/contracts/Employee.sol/Employee.json');
const Employee = require('../models/employee');
const logger = require('../utils/logger');

// Initialize blockchain connection
const getEmployeeContract = () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);
    return new ethers.Contract(
      process.env.EMPLOYEE_CONTRACT_ADDRESS,
      employeeArtifact.abi,
      wallet
    );
  } catch (error) {
    logger.error(`Failed to initialize blockchain connection: ${error.message}`);
    return null;
  }
};

/**
 * @route GET /api/blockchain/employees/:id/verify
 * @desc Verify if an employee exists on the blockchain
 * @access Private
 */
router.get('/employees/:id/verify', async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    // Check if employee exists in database
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found in database'
      });
    }
    
    const employeeContract = getEmployeeContract();
    if (!employeeContract) {
      return res.status(503).json({
        success: false,
        message: 'Blockchain connection unavailable',
        error: 'BLOCKCHAIN_CONNECTION_ERROR'
      });
    }
    
    // Check blockchain status
    const exists = await employeeContract.employeeExists(employeeId);
    
    return res.status(200).json({
      success: true,
      data: {
        employee_id: employeeId,
        exists_in_database: true,
        exists_on_blockchain: exists,
        blockchain_tx_hash: employee.blockchain_tx_hash || null
      }
    });
  } catch (error) {
    logger.error(`Blockchain verification error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error verifying employee on blockchain',
      error: error.message
    });
  }
});

/**
 * @route POST /api/blockchain/employees/:id/register
 * @desc Register an employee on the blockchain if not already registered
 * @access Private
 */
router.post('/employees/:id/register', async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    // Check if employee exists in database
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found in database'
      });
    }
    
    const employeeContract = getEmployeeContract();
    if (!employeeContract) {
      return res.status(503).json({
        success: false,
        message: 'Blockchain connection unavailable',
        error: 'BLOCKCHAIN_CONNECTION_ERROR'
      });
    }
    
    // Check if already on blockchain
    const exists = await employeeContract.employeeExists(employeeId);
    if (exists) {
      return res.status(200).json({
        success: true,
        message: 'Employee already registered on blockchain',
        data: {
          employee_id: employeeId,
          blockchain_tx_hash: employee.blockchain_tx_hash
        }
      });
    }
    
    // Add to blockchain
    const tx = await employeeContract.addEmployee(
      employeeId,
      employee.name,
      employee.position,
      employee.department,
      employee.hire_date ? Math.floor(new Date(employee.hire_date).getTime() / 1000) : 0
    );
    
    // Update database with transaction hash
    await employee.update({ blockchain_tx_hash: tx.hash });
    
    return res.status(201).json({
      success: true,
      message: 'Employee successfully registered on blockchain',
      data: {
        employee_id: employeeId,
        blockchain_tx_hash: tx.hash,
        transaction_status: 'submitted'
      }
    });
  } catch (error) {
    logger.error(`Blockchain registration error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error registering employee on blockchain',
      error: error.message
    });
  }
});

/**
 * @route GET /api/blockchain/employees/status
 * @desc Get blockchain synchronization status for all employees
 * @access Private
 */
router.get('/employees/status', async (req, res) => {
  try {
    // Get all employees from database
    const employees = await Employee.findAll();
    
    const employeeContract = getEmployeeContract();
    if (!employeeContract) {
      return res.status(503).json({
        success: false,
        message: 'Blockchain connection unavailable',
        error: 'BLOCKCHAIN_CONNECTION_ERROR'
      });
    }
    
    // Check blockchain status for each employee
    const statusPromises = employees.map(async (employee) => {
      try {
        const exists = await employeeContract.employeeExists(employee.id);
        return {
          employee_id: employee.id,
          name: employee.name,
          exists_on_blockchain: exists,
          blockchain_tx_hash: employee.blockchain_tx_hash || null
        };
      } catch (error) {
        logger.error(`Error checking employee ${employee.id}: ${error.message}`);
        return {
          employee_id: employee.id,
          name: employee.name,
          exists_on_blockchain: false,
          error: 'VERIFICATION_ERROR'
        };
      }
    });
    
    const statuses = await Promise.all(statusPromises);
    
    // Calculate statistics
    const total = statuses.length;
    const synced = statuses.filter(s => s.exists_on_blockchain).length;
    const unsynced = total - synced;
    
    return res.status(200).json({
      success: true,
      data: {
        statistics: {
          total_employees: total,
          blockchain_synced: synced,
          blockchain_unsynced: unsynced,
          sync_percentage: total > 0 ? Math.round((synced / total) * 100) : 0
        },
        employees: statuses
      }
    });
  } catch (error) {
    logger.error(`Blockchain status error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving blockchain status',
      error: error.message
    });
  }
});

module.exports = router; 