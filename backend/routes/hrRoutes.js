const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const { authenticateHR } = require('../middleware/authMiddleware');

// Get all HR users (for testing)
router.get('/all', async (req, res) => {
    try {
        console.log('📊 Fetching all HR users from database...');
        
        const { data, error } = await supabase
            .from('hr_users')
            .select('*');

        if (error) {
            console.error('❌ Database error:', error);
            throw error;
        }

        console.log('📋 HR Users Table Data:');
        console.table(data);

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('❌ Error fetching HR users:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch HR users'
        });
    }
});

// Get HR details
router.get('/details', authenticateHR, async (req, res) => {
    try {
        console.log('🔍 Fetching HR details for wallet:', req.hrUser.wallet);
        
        const { data, error } = await supabase
            .from('hr_users')
            .select('*')
            .eq('wallet', req.hrUser.wallet)
            .single();

        if (error) {
            console.error('❌ Database error:', error);
            throw error;
        }

        console.log('📋 HR User Details:');
        console.table([data]);

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('❌ Error in HR details endpoint:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch HR details'
        });
    }
});

module.exports = router; 