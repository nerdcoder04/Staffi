/**
 * Script to check all employees in database and add them to blockchain if needed
 * Run with: node scripts/sync-employees-to-blockchain.js
 */

require('dotenv').config();
const logger = require('../utils/logger');
const supabase = require('../utils/supabaseClient');
const blockchainService = require('../utils/blockchainService');

// Helper function to get role and department names by IDs
const getRoleAndDepartmentNames = async (roleId, deptId) => {
  try {
    // Get role name
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('role_name')
      .eq('id', roleId)
      .single();
    
    // Get department name
    const { data: deptData, error: deptError } = await supabase
      .from('departments')
      .select('dept_name')
      .eq('id', deptId)
      .single();
    
    if (roleError || deptError) {
      logger.error('Error fetching role or department data');
      return { role: 'Unknown', department: 'Unknown' };
    }
    
    return {
      role: roleData?.role_name || 'Unknown',
      department: deptData?.dept_name || 'Unknown'
    };
  } catch (error) {
    logger.error('Error in getRoleAndDepartmentNames:', error);
    return { role: 'Unknown', department: 'Unknown' };
  }
};

// Main sync function
const syncEmployeesToBlockchain = async () => {
  try {
    logger.info('Starting employee-blockchain synchronization');

    // Check blockchain availability
    const blockchainAvailable = await blockchainService.isBlockchainAvailable();
    if (!blockchainAvailable) {
      logger.error('Blockchain not available. Please check your configuration.');
      process.exit(1);
    }

    // Get all employees from database
    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, name, wallet, role_id, department_id, doj');

    if (error) {
      logger.error('Error fetching employees:', error);
      process.exit(1);
    }

    logger.info(`Found ${employees.length} employees in database`);

    // Loop through each employee and process
    let successCount = 0;
    let existingCount = 0;
    let failedCount = 0;

    for (const employee of employees) {
      try {
        // Check if employee exists on blockchain
        const blockchainStatus = await blockchainService.checkEmployeeExistsOnBlockchain(employee.id);
        
        if (blockchainStatus.exists) {
          logger.info(`Employee ${employee.id} (${employee.name}) already exists on blockchain`);
          existingCount++;
          continue;
        }

        // Get role and department names
        const { role, department } = await getRoleAndDepartmentNames(
          employee.role_id, 
          employee.department_id
        );

        // Add to blockchain
        logger.info(`Adding employee ${employee.id} (${employee.name}) to blockchain...`);
        const result = await blockchainService.addEmployeeToBlockchain(
          employee.id,
          employee.name,
          employee.wallet,
          role,
          employee.doj,
          department
        );

        if (result.success) {
          logger.info(`Successfully added employee ${employee.id} to blockchain, tx: ${result.txHash}`);
          successCount++;
        } else {
          logger.error(`Failed to add employee ${employee.id} to blockchain: ${result.reason}`);
          failedCount++;
        }
      } catch (empError) {
        logger.error(`Error processing employee ${employee.id}:`, empError);
        failedCount++;
      }
    }

    logger.info('Synchronization complete:');
    logger.info(`  Employees already on blockchain: ${existingCount}`);
    logger.info(`  Employees successfully added: ${successCount}`);
    logger.info(`  Failed additions: ${failedCount}`);
    
    process.exit(0);
  } catch (error) {
    logger.error('Synchronization error:', error);
    process.exit(1);
  }
};

// Run the sync
syncEmployeesToBlockchain(); 