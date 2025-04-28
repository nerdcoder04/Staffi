#!/usr/bin/env node

/**
 * Script to synchronize employee data with the blockchain
 * 
 * This script:
 * 1. Fetches all employees from the database
 * 2. Checks if each employee exists on the blockchain
 * 3. Adds employees that don't exist on the blockchain
 * 4. Logs detailed results of the synchronization process
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const { sequelize } = require('../backend/models');
const { Employee } = require('../backend/models');
const logger = require('../backend/utils/logger');

// Import Employee ABI
const employeeArtifact = require('../contracts/artifacts/contracts/Employee.sol/Employee.json');

// Setup blockchain connection
const setupBlockchainConnection = () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);
    const employeeContract = new ethers.Contract(
      process.env.EMPLOYEE_CONTRACT_ADDRESS,
      employeeArtifact.abi,
      wallet
    );
    
    return { provider, wallet, employeeContract };
  } catch (error) {
    logger.error(`Failed to setup blockchain connection: ${error.message}`);
    throw new Error('Blockchain connection failed');
  }
};

// Check if employee exists on blockchain
const checkEmployeeOnBlockchain = async (employeeContract, employeeId) => {
  try {
    const exists = await employeeContract.employeeExists(employeeId);
    return exists;
  } catch (error) {
    logger.error(`Failed to check employee ${employeeId} on blockchain: ${error.message}`);
    return false;
  }
};

// Add employee to blockchain
const addEmployeeToBlockchain = async (employeeContract, employee) => {
  try {
    const tx = await employeeContract.addEmployee(
      employee.id,
      employee.name,
      employee.role,
      employee.department
    );
    
    const receipt = await tx.wait();
    
    // Update employee record with transaction hash
    await employee.update({
      blockchain_tx: receipt.transactionHash,
      updated_at: new Date()
    });
    
    logger.info(`Employee ${employee.id} added to blockchain with tx: ${receipt.transactionHash}`);
    return receipt.transactionHash;
  } catch (error) {
    logger.error(`Failed to add employee ${employee.id} to blockchain: ${error.message}`);
    return null;
  }
};

// Main sync function
const syncEmployeesToBlockchain = async () => {
  let connection;
  const results = {
    total: 0,
    alreadyOnBlockchain: 0,
    successfullyAdded: 0,
    failed: 0
  };
  
  try {
    // Setup blockchain connection
    connection = setupBlockchainConnection();
    const { employeeContract } = connection;
    
    // Fetch all employees from database
    const employees = await Employee.findAll();
    results.total = employees.length;
    
    logger.info(`Starting synchronization of ${employees.length} employees to blockchain`);
    
    // Process each employee
    for (const employee of employees) {
      // Skip employees that already have a blockchain transaction
      if (employee.blockchain_tx) {
        results.alreadyOnBlockchain++;
        continue;
      }
      
      // Check if employee exists on blockchain
      const exists = await checkEmployeeOnBlockchain(employeeContract, employee.id);
      if (exists) {
        logger.info(`Employee ${employee.id} already exists on blockchain but was not marked in database`);
        results.alreadyOnBlockchain++;
        continue;
      }
      
      // Add employee to blockchain
      const txHash = await addEmployeeToBlockchain(employeeContract, employee);
      if (txHash) {
        results.successfullyAdded++;
      } else {
        results.failed++;
      }
    }
    
    logger.info('Employee synchronization completed', { results });
    console.log('\nSynchronization Results:');
    console.log(`Total employees: ${results.total}`);
    console.log(`Already on blockchain: ${results.alreadyOnBlockchain}`);
    console.log(`Successfully added: ${results.successfullyAdded}`);
    console.log(`Failed to add: ${results.failed}`);
    
  } catch (error) {
    logger.error(`Employee synchronization failed: ${error.message}`);
    console.error('Synchronization failed:', error.message);
  } finally {
    // Close database connection
    await sequelize.close();
  }
};

// Execute the script
syncEmployeesToBlockchain()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 