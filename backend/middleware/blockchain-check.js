/**
 * Middleware to check and verify blockchain-related status for employee APIs
 * This middleware validates that the employee exists on the blockchain when required
 */

const { ethers } = require('ethers');
const Employee = require('../models/employee');
const logger = require('../utils/logger');

/**
 * Initialize the connection to the blockchain and get a contract instance
 * @returns {Object} Employee contract instance
 */
const getEmployeeContract = () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);
    
    // Get the ABI from the compiled contract
    const employeeContractAbi = require('../../contracts/artifacts/contracts/Employee.sol/Employee.json').abi;
    const contractAddress = process.env.EMPLOYEE_CONTRACT_ADDRESS;
    
    // Return the contract instance
    return new ethers.Contract(contractAddress, employeeContractAbi, wallet);
  } catch (error) {
    logger.error(`Error initializing blockchain connection: ${error.message}`);
    throw new Error('Failed to connect to blockchain');
  }
};

/**
 * Check if an employee exists on the blockchain
 * @param {string} employeeId - Employee ID to check
 * @returns {Promise<boolean>} - True if employee exists on blockchain
 */
const checkEmployeeOnBlockchain = async (employeeId) => {
  try {
    const contract = getEmployeeContract();
    const exists = await contract.employeeExists(employeeId);
    return exists;
  } catch (error) {
    logger.error(`Blockchain verification error for employee ${employeeId}: ${error.message}`);
    return false;
  }
};

/**
 * Middleware to verify employee existence on blockchain
 * This is a strict middleware that will block the request if verification fails
 */
const verifyEmployeeOnBlockchain = async (req, res, next) => {
  const employeeId = req.params.id;
  
  try {
    // Check if employee exists in database first
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found in database'
      });
    }
    
    // Skip blockchain verification if in development or test mode
    if (process.env.NODE_ENV === 'test' || process.env.SKIP_BLOCKCHAIN_VERIFICATION === 'true') {
      req.blockchainVerified = 'skipped';
      return next();
    }
    
    // Check if employee exists on blockchain
    const exists = await checkEmployeeOnBlockchain(employeeId);
    if (!exists) {
      return res.status(403).json({
        success: false,
        message: 'Employee verification failed: Not registered on blockchain',
        employee_id: employeeId,
        blockchain_status: 'not_verified'
      });
    }
    
    // Employee verified
    req.blockchainVerified = true;
    return next();
  } catch (error) {
    logger.error(`Blockchain middleware error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Blockchain verification system error',
      error: error.message
    });
  }
};

/**
 * Middleware to attach blockchain status to employee data without blocking the request
 * This is a non-strict middleware that attaches blockchain status info without blocking
 */
const attachBlockchainStatus = async (req, res, next) => {
  try {
    // Skip blockchain verification if in development or test mode
    if (process.env.NODE_ENV === 'test' || process.env.SKIP_BLOCKCHAIN_VERIFICATION === 'true') {
      req.blockchainVerified = 'skipped';
      return next();
    }
    
    // Get all employees to check blockchain status in batch
    const employees = await Employee.findAll();
    
    // Skip if no employees found
    if (!employees || employees.length === 0) {
      req.blockchainVerified = 'no_employees';
      return next();
    }
    
    // Get employee contract once
    const contract = getEmployeeContract();
    
    // Check blockchain status for each employee
    const employeePromises = employees.map(async (employee) => {
      try {
        const exists = await contract.employeeExists(employee.id);
        employee.dataValues.blockchain_verified = exists;
        return employee;
      } catch (error) {
        logger.error(`Error checking blockchain for employee ${employee.id}: ${error.message}`);
        employee.dataValues.blockchain_verified = 'error';
        return employee;
      }
    });
    
    // Wait for all promises to resolve
    const employeesWithBlockchainStatus = await Promise.all(employeePromises);
    
    // Add blockchain status to request object
    req.employees = employeesWithBlockchainStatus;
    req.blockchainVerified = true;
    
    return next();
  } catch (error) {
    logger.error(`Blockchain status middleware error: ${error.message}`);
    // Don't block the request, just mark as not verified
    req.blockchainVerified = false;
    return next();
  }
};

module.exports = {
  verifyEmployeeOnBlockchain,
  attachBlockchainStatus,
  checkEmployeeOnBlockchain
}; 