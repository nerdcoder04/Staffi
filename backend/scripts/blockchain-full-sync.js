/**
 * Complete blockchain synchronization script
 * This script:
 * 1. Syncs all employees to the blockchain
 * 2. Syncs all employee statuses to blockchain
 * 3. Syncs all status history to blockchain
 * 
 * Run with: node scripts/blockchain-full-sync.js
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

// Function to map status strings to string values for blockchain
const mapStatusForBlockchain = (status) => {
  // Convert database status format to blockchain format if needed
  switch(status) {
    case true: // Boolean active status in older records
      return 'ACTIVE';
    case false: // Boolean inactive status in older records
      return 'INACTIVE';
    default:
      return status; // Use status string directly if it's already a string
  }
};

// Function to check if a status transition record has already been recorded on blockchain
const isTransitionRecordedOnBlockchain = (historyRecord) => {
  return !!historyRecord.blockchain_tx; // If blockchain_tx exists, it's already recorded
};

// Function to sync all employees to blockchain
const syncEmployeesToBlockchain = async () => {
  try {
    logger.info('Starting employee-blockchain synchronization');

    // Get all employees from database with their current status
    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, name, wallet, role_id, department_id, doj, status');

    if (error) {
      logger.error('Error fetching employees:', error);
      return { 
        success: false, 
        employeesTotal: 0,
        employeesExisting: 0,
        employeesAdded: 0,
        employeesFailed: 0,
        statusUpdates: 0,
        statusFailed: 0
      };
    }

    logger.info(`Found ${employees.length} employees in database`);

    // Loop through each employee and process
    let successCount = 0;
    let existingCount = 0;
    let failedCount = 0;
    let statusUpdateCount = 0;
    let statusFailedCount = 0;

    for (const employee of employees) {
      try {
        // Check if employee exists on blockchain
        const blockchainStatus = await blockchainService.checkEmployeeExistsOnBlockchain(employee.id);
        
        if (blockchainStatus.exists) {
          logger.info(`Employee ${employee.id} (${employee.name}) already exists on blockchain`);
          existingCount++;
          
          // Sync status for existing employees
          try {
            const mappedStatus = mapStatusForBlockchain(employee.status);
            logger.info(`Updating status for employee ${employee.id} (${employee.name}) to ${mappedStatus} on blockchain...`);
            
            const statusResult = await blockchainService.updateEmployeeStatus(
              employee.id, 
              mappedStatus,
              "Status sync from database"
            );
            
            if (statusResult.success) {
              logger.info(`Successfully updated status for employee ${employee.id} to ${mappedStatus}, tx: ${statusResult.txHash}`);
              statusUpdateCount++;
            } else {
              logger.error(`Failed to update status for employee ${employee.id}: ${statusResult.reason}`);
              statusFailedCount++;
            }
          } catch (statusError) {
            logger.error(`Error updating status for employee ${employee.id}:`, statusError);
            statusFailedCount++;
          }
          
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
          
          // Also update status for newly added employees
          try {
            const mappedStatus = mapStatusForBlockchain(employee.status);
            logger.info(`Setting initial status for employee ${employee.id} (${employee.name}) to ${mappedStatus} on blockchain...`);
            
            const statusResult = await blockchainService.updateEmployeeStatus(
              employee.id, 
              mappedStatus,
              "Initial status from database sync"
            );
            
            if (statusResult.success) {
              logger.info(`Successfully set initial status for employee ${employee.id} to ${mappedStatus}, tx: ${statusResult.txHash}`);
              statusUpdateCount++;
            } else {
              logger.error(`Failed to set initial status for employee ${employee.id}: ${statusResult.reason}`);
              statusFailedCount++;
            }
          } catch (statusError) {
            logger.error(`Error setting initial status for employee ${employee.id}:`, statusError);
            statusFailedCount++;
          }
        } else {
          logger.error(`Failed to add employee ${employee.id} to blockchain: ${result.reason}`);
          failedCount++;
        }
      } catch (empError) {
        logger.error(`Error processing employee ${employee.id}:`, empError);
        failedCount++;
      }
    }

    logger.info('Employee synchronization complete:');
    logger.info(`  Employees already on blockchain: ${existingCount}`);
    logger.info(`  Employees successfully added: ${successCount}`);
    logger.info(`  Failed additions: ${failedCount}`);
    logger.info(`  Status updates successful: ${statusUpdateCount}`);
    logger.info(`  Status updates failed: ${statusFailedCount}`);
    
    return {
      success: true,
      employeesTotal: employees.length,
      employeesExisting: existingCount,
      employeesAdded: successCount,
      employeesFailed: failedCount,
      statusUpdates: statusUpdateCount,
      statusFailed: statusFailedCount
    };
  } catch (error) {
    logger.error('Employee synchronization error:', error);
    return { success: false };
  }
};

// Function to sync status history to blockchain
const syncStatusHistoryToBlockchain = async () => {
  try {
    logger.info('Starting employee status history blockchain synchronization');

    // Get all status history records without blockchain transaction hashes
    const { data: historyRecords, error } = await supabase
      .from('employee_status_history')
      .select('*')
      .is('blockchain_tx', null)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Error fetching status history records:', error);
      return {
        success: false,
        recordsTotal: 0,
        recordsSuccess: 0,
        recordsFailed: 0
      };
    }

    logger.info(`Found ${historyRecords.length} status history records not yet recorded on blockchain`);

    // Loop through each record and process
    let successCount = 0;
    let failedCount = 0;

    for (const record of historyRecords) {
      try {
        // Skip if already recorded on blockchain (double-check)
        if (isTransitionRecordedOnBlockchain(record)) {
          logger.info(`Status change ${record.id} already recorded on blockchain, skipping`);
          continue;
        }

        logger.info(`Recording status change for employee ${record.employee_id} from ${record.previous_status || 'NONE'} to ${record.new_status} on blockchain...`);
        
        // Call blockchain service to record status change
        const result = await blockchainService.updateEmployeeStatus(
          record.employee_id,
          record.new_status,
          record.reason || 'Status change from database sync'
        );

        if (result.success) {
          // Update the history record with the transaction hash
          const { data: updatedRecord, error: updateError } = await supabase
            .from('employee_status_history')
            .update({ blockchain_tx: result.txHash })
            .eq('id', record.id)
            .select()
            .single();

          if (updateError) {
            logger.error(`Failed to update status history record ${record.id} with blockchain tx hash:`, updateError);
            failedCount++;
          } else {
            logger.info(`Successfully recorded status change ${record.id} on blockchain, tx: ${result.txHash}`);
            successCount++;
          }
        } else {
          logger.error(`Failed to record status change ${record.id} on blockchain: ${result.reason}`);
          failedCount++;
        }
      } catch (recordError) {
        logger.error(`Error processing status history record ${record.id}:`, recordError);
        failedCount++;
      }
    }

    logger.info('Status history synchronization complete:');
    logger.info(`  Records successfully recorded on blockchain: ${successCount}`);
    logger.info(`  Failed recordings: ${failedCount}`);
    
    return {
      success: true,
      recordsTotal: historyRecords.length,
      recordsSuccess: successCount,
      recordsFailed: failedCount
    };
  } catch (error) {
    logger.error('Status history synchronization error:', error);
    return { success: false };
  }
};

// Main function to run full sync
const runFullSync = async () => {
  try {
    logger.info('=== STARTING FULL BLOCKCHAIN SYNCHRONIZATION ===');
    logger.info(`Timestamp: ${new Date().toISOString()}`);
    
    // Check blockchain availability
    const blockchainAvailable = await blockchainService.isBlockchainAvailable();
    if (!blockchainAvailable) {
      logger.error('Blockchain not available. Please check your configuration.');
      process.exit(1);
    }
    
    // 1. Sync employees
    const employeeResult = await syncEmployeesToBlockchain();
    
    // 2. Sync status history
    const historyResult = await syncStatusHistoryToBlockchain();
    
    // Log summary
    logger.info('');
    logger.info('=== FULL BLOCKCHAIN SYNCHRONIZATION COMPLETE ===');
    logger.info(`Employees processed: ${employeeResult.employeesTotal}`);
    logger.info(`  - Already on blockchain: ${employeeResult.employeesExisting}`);
    logger.info(`  - Added to blockchain: ${employeeResult.employeesAdded}`);
    logger.info(`  - Failed to add: ${employeeResult.employeesFailed}`);
    logger.info(`Status updates: ${employeeResult.statusUpdates + historyResult.recordsSuccess} successful, ${employeeResult.statusFailed + historyResult.recordsFailed} failed`);
    logger.info(`Status history records processed: ${historyResult.recordsTotal}`);
    logger.info(`  - Successfully recorded: ${historyResult.recordsSuccess}`);
    logger.info(`  - Failed to record: ${historyResult.recordsFailed}`);
    logger.info(`Timestamp: ${new Date().toISOString()}`);
    
    process.exit(0);
  } catch (error) {
    logger.error('Full synchronization error:', error);
    process.exit(1);
  }
};

// Run the full sync
runFullSync(); 