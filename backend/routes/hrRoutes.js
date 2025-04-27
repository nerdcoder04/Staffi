const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const { authenticateHR } = require('../middleware/authMiddleware');

// Create new HR user
router.post('/add', async (req, res) => {
    try {
        const { walletAddress, name, email } = req.body;

        if (!walletAddress || !name || !email) {
            return res.status(400).json({ 
                error: 'Wallet address, name, and email are required' 
            });
        }

        // Check if HR user with this wallet already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('hr_users')
            .select('wallet')
            .eq('wallet', walletAddress.toLowerCase())
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'HR user with this wallet address already exists' });
        }

        // Check if HR user with this email already exists
        const { data: existingEmail, error: emailCheckError } = await supabase
            .from('hr_users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingEmail) {
            return res.status(400).json({ error: 'HR user with this email already exists' });
        }

        // Insert new HR user
        const { data, error } = await supabase
            .from('hr_users')
            .insert([
                {
                    wallet: walletAddress.toLowerCase(),
                    name,
                    email
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('❌ Error adding HR user:', error);
            return res.status(500).json({ error: error.message || 'Failed to create HR user' });
        }

        console.log('✅ HR user added successfully:', data.email);

        res.status(201).json({
            message: 'HR user added successfully',
            user: data
        });
    } catch (error) {
        console.error('❌ Error in add HR endpoint:', error);
        res.status(500).json({
            error: error.message || 'Failed to add HR user'
        });
    }
});

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