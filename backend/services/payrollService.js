/**
 * Payroll Service
 * Handles payroll operations and blockchain integration with Payroll.sol
 */

const logger = require('../utils/logger');
const supabase = require('./supabaseService');
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Initialize blockchain components
let provider, wallet;
let payrollContract, payrollABI;

/**
 * Initialize the payroll contract connection
 */
const initPayrollContract = () => {
  if (process.env.NODE_ENV === 'test') {
    logger.info('Test mode - blockchain operations will be skipped');
    return false;
  }

  try {
    // Load contract ABI
    try {
      payrollABI = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '../../contracts/artifacts/contracts/Payroll.sol/Payroll.json')
        )
      ).abi;
    } catch (error) {
      logger.error('Error loading Payroll ABI:', error.message);
      return false;
    }

    // Provider setup for blockchain interaction
    const infuraApiKey = process.env.INFURA_API_KEY;
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_URL || 
                         (infuraApiKey ? `https://sepolia.infura.io/v3/${infuraApiKey}` : 
                         "http://localhost:8545");
    
    logger.info(`Connecting to Ethereum network for Payroll contract at: ${ethereumRpcUrl.replace(infuraApiKey || '', 'REDACTED')}`);
    provider = new ethers.JsonRpcProvider(ethereumRpcUrl);
    
    // Initialize wallet with private key
    if (!process.env.PRIVATE_KEY) {
      logger.error('PRIVATE_KEY not set in environment');
      return false;
    }

    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Initialize contract with address
    const contractAddress = process.env.PAYROLL_CONTRACT_ADDRESS;
    if (contractAddress && contractAddress.trim() !== "") {
      payrollContract = new ethers.Contract(
        contractAddress,
        payrollABI,
        wallet
      );
      logger.info(`Payroll contract initialized at address: ${contractAddress}`);
      return true;
    } else {
      logger.warn('Payroll contract not initialized: Missing contract address');
      return false;
    }
  } catch (error) {
    logger.error('Error initializing Payroll contract:', error.message);
    return false;
  }
};

/**
 * Check if payroll blockchain connection is available
 */
const isPayrollContractAvailable = async () => {
  if (process.env.NODE_ENV === 'test' || !provider || !payrollContract) {
    return false;
  }

  try {
    await provider.getBlockNumber();
    return true;
  } catch (error) {
    logger.error('Payroll blockchain provider connection failed:', error.message);
    return false;
  }
};

/**
 * Log a payroll transaction on the blockchain
 * @param {string} employeeId - Database UUID of the employee
 * @param {number} amount - Payment amount
 * @returns {Object} Transaction result
 */
const logPayrollTransaction = async (employeeId, amount) => {
  if (process.env.NODE_ENV === 'test' || !payrollContract) {
    logger.warn('Skipping blockchain operation in test mode or contract not initialized');
    return { success: false, reason: 'Test mode or contract not initialized' };
  }

  try {
    // Check connection first
    if (!await isPayrollContractAvailable()) {
      return { success: false, reason: 'Blockchain connection not available' };
    }
    
    // Call the smart contract function
    const tx = await payrollContract.logPayroll(
      employeeId,
      amount
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    logger.info(`Payroll transaction recorded on blockchain for employee ID: ${employeeId}, amount: ${amount}, tx: ${tx.hash}`);
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    logger.error(`Error recording payroll transaction on blockchain: ${error.message}`);
    return {
      success: false,
      reason: error.message
    };
  }
};

/**
 * Save payroll record to database
 * @param {string} employeeId - Database UUID of the employee
 * @param {number} amount - Payment amount 
 * @param {string} txHash - Blockchain transaction hash
 * @returns {Object} Database insert result
 */
const savePayrollRecord = async (employeeId, amount, txHash) => {
  try {
    const { data, error } = await supabase
      .from('payrolls')
      .insert({
        emp_id: employeeId,
        amount: amount,
        tx_hash: txHash
      });

    if (error) {
      logger.error('Error saving payroll record to database:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    logger.error('Exception saving payroll record to database:', error);
    return { success: false, error };
  }
};

/**
 * Get employee payroll history
 * @param {string} employeeId - Database UUID of the employee
 * @returns {Array} Payroll records for the employee
 */
const getEmployeePayrollHistory = async (employeeId) => {
  try {
    const { data, error } = await supabase
      .from('payrolls')
      .select('*')
      .eq('emp_id', employeeId)
      .order('timestamp', { ascending: false });

    if (error) {
      logger.error('Error fetching employee payroll history:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    logger.error('Exception fetching employee payroll history:', error);
    return { success: false, error };
  }
};

/**
 * Get all payroll records with pagination
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {Array} Payroll records
 */
const getAllPayrollRecords = async (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  try {
    const { data, error, count } = await supabase
      .from('payrolls')
      .select('*, employees!inner(name, email)', { count: 'exact' })
      .range(from, to)
      .order('timestamp', { ascending: false });

    if (error) {
      logger.error('Error fetching all payroll records:', error);
      return { success: false, error };
    }

    return { 
      success: true, 
      data,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    logger.error('Exception fetching all payroll records:', error);
    return { success: false, error };
  }
};

// Initialize contract on module load
const initialized = initPayrollContract();

module.exports = {
  isPayrollContractAvailable,
  logPayrollTransaction,
  savePayrollRecord,
  getEmployeePayrollHistory,
  getAllPayrollRecords
}; 