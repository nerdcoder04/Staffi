const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const ethers = require('ethers');

// Initialize blockchain components
let provider, wallet;
let employeeContract, employeeABI;

// Initialize blockchain provider and contracts
const initBlockchain = () => {
  if (process.env.NODE_ENV === 'test') {
    logger.info('Test mode - blockchain operations will be skipped');
    return false;
  }

  try {
    // Load contract ABI
    try {
      employeeABI = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '../../contracts/artifacts/contracts/Employee.sol/Employee.json')
        )
      ).abi;
    } catch (error) {
      logger.error('Error loading Employee ABI:', error.message);
      return false;
    }

    // Provider setup for blockchain interaction
    const infuraApiKey = process.env.INFURA_API_KEY;
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_URL || 
                         (infuraApiKey ? `https://sepolia.infura.io/v3/${infuraApiKey}` : 
                         "http://localhost:8545");
    
    logger.info(`Connecting to Ethereum network at: ${ethereumRpcUrl.replace(infuraApiKey || '', 'REDACTED')}`);
    provider = new ethers.JsonRpcProvider(ethereumRpcUrl);
    
    // Add connection timeout and retry logic
    provider.pollingInterval = 5000; // Increase polling interval to 5 seconds
    
    // Initialize wallet with private key
    if (!process.env.PRIVATE_KEY) {
      logger.error('PRIVATE_KEY not set in environment');
      return false;
    }

    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Initialize contract with address
    const contractAddress = process.env.EMPLOYEE_CONTRACT_ADDRESS;
    if (contractAddress && contractAddress.trim() !== "") {
      employeeContract = new ethers.Contract(
        contractAddress,
        employeeABI,
        wallet
      );
      logger.info(`Employee contract initialized at address: ${contractAddress}`);
      return true;
    } else {
      logger.warn('Employee contract not initialized: Missing contract address');
      return false;
    }
  } catch (error) {
    logger.error('Error initializing blockchain components:', error.message);
    return false;
  }
};

// Check if blockchain connection is available
const isBlockchainAvailable = async () => {
  if (process.env.NODE_ENV === 'test' || !provider || !employeeContract) {
    return false;
  }

  try {
    await provider.getBlockNumber();
    return true;
  } catch (error) {
    logger.error('Blockchain provider connection failed:', error.message);
    return false;
  }
};

// Add employee to blockchain
const addEmployeeToBlockchain = async (employeeId, name, wallet, role, doj, department) => {
  if (process.env.NODE_ENV === 'test' || !employeeContract) {
    logger.warn('Skipping blockchain operation in test mode or contract not initialized');
    return { success: false, reason: 'Test mode or contract not initialized' };
  }

  try {
    // Check connection first
    if (!await isBlockchainAvailable()) {
      return { success: false, reason: 'Blockchain connection not available' };
    }

    // Convert empty wallet to zero address
    const walletAddress = wallet || "0x0000000000000000000000000000000000000000";
    
    // Add employee to blockchain
    const tx = await employeeContract.addEmployee(
      employeeId,
      name,
      walletAddress,
      role,
      doj,
      department
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    logger.info(`Employee added to blockchain: ${employeeId}, tx: ${tx.hash}`);
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    logger.error(`Error adding employee to blockchain: ${error.message}`);
    return {
      success: false,
      reason: error.message
    };
  }
};

// Record leave approval on blockchain
const recordLeaveApproval = async (employeeId, leaveDays, reason) => {
  if (process.env.NODE_ENV === 'test' || !employeeContract) {
    logger.warn('Skipping blockchain operation in test mode or contract not initialized');
    return { success: false, reason: 'Test mode or contract not initialized' };
  }

  try {
    // Check connection first
    if (!await isBlockchainAvailable()) {
      return { success: false, reason: 'Blockchain connection not available' };
    }
    
    // Call the smart contract function
    const tx = await employeeContract.leaveApproved(
      employeeId,
      leaveDays,
      reason
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    logger.info(`Leave approval recorded on blockchain for employee ID: ${employeeId}, tx: ${tx.hash}`);
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    logger.error(`Error recording leave approval on blockchain: ${error.message}`);
    return {
      success: false,
      reason: error.message
    };
  }
};

// Check if employee exists on blockchain
const checkEmployeeExistsOnBlockchain = async (employeeId) => {
  if (process.env.NODE_ENV === 'test' || !employeeContract) {
    logger.warn('Skipping blockchain check in test mode or contract not initialized');
    return { exists: false, reason: 'Test mode or contract not initialized' };
  }

  try {
    // Check connection first
    if (!await isBlockchainAvailable()) {
      return { exists: false, reason: 'Blockchain connection not available' };
    }
    
    // Call the isEmployee function
    const exists = await employeeContract.isEmployee(employeeId);
    return { exists };
  } catch (error) {
    logger.error(`Error checking if employee exists on blockchain: ${error.message}`);
    return {
      exists: false,
      reason: error.message
    };
  }
};

// Initialize blockchain on module load
const initialized = initBlockchain();

module.exports = {
  isBlockchainAvailable,
  addEmployeeToBlockchain,
  recordLeaveApproval,
  checkEmployeeExistsOnBlockchain
}; 