/**
 * Blockchain Service Update for Employee Status
 * 
 * Add the following function to your blockchainService.js file
 * to support recording employee status changes on the blockchain:
 */

// Update employee status on blockchain
const updateEmployeeStatus = async (employeeId, status, reason) => {
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
      // Note: Your smart contract must have a function like updateEmployeeStatus
      // If not, you may need to deploy a new version with this functionality
      const tx = await employeeContract.updateEmployeeStatus(
        employeeId,
        status,
        reason || ''
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      logger.info(`Employee status update recorded on blockchain for employee ID: ${employeeId}, status: ${status}, tx: ${tx.hash}`);
      
      return {
        success: true,
        txHash: tx.hash
      };
    } catch (error) {
      logger.error(`Error recording employee status on blockchain: ${error.message}`);
      return {
        success: false,
        reason: error.message
      };
    }
};

// Add this function to the module.exports
module.exports = {
    // ... existing exports
    updateEmployeeStatus
}; 