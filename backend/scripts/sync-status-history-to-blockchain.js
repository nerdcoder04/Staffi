/**
 * Script to sync employee status history to blockchain
 * This ensures all status changes are recorded on the blockchain
 * Run with: node scripts/sync-status-history-to-blockchain.js
 */

require('dotenv').config();
const logger = require('../utils/logger');
const supabase = require('../utils/supabaseClient');
const blockchainService = require('../utils/blockchainService');

// Function to check if a status transition record has already been recorded on blockchain
const isTransitionRecordedOnBlockchain = (historyRecord) => {
  return !!historyRecord.blockchain_tx; // If blockchain_tx exists, it's already recorded
};

// Main sync function
const syncStatusHistoryToBlockchain = async () => {
  try {
    logger.info('Starting employee status history blockchain synchronization');

    // Check blockchain availability
    const blockchainAvailable = await blockchainService.isBlockchainAvailable();
    if (!blockchainAvailable) {
      logger.error('Blockchain not available. Please check your configuration.');
      process.exit(1);
    }

    // Get all status history records without blockchain transaction hashes
    const { data: historyRecords, error } = await supabase
      .from('employee_status_history')
      .select('*')
      .is('blockchain_tx', null)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Error fetching status history records:', error);
      process.exit(1);
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
    
    process.exit(0);
  } catch (error) {
    logger.error('Status history synchronization error:', error);
    process.exit(1);
  }
};

// Run the sync
syncStatusHistoryToBlockchain(); 