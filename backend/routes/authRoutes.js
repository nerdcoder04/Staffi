const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// HR Wallet Login
router.post('/hr-login', async (req, res) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
        }

        console.log('🔑 Attempting HR authentication for wallet:', walletAddress);

        const { data: hrUser, error } = await supabase
            .from('hr_users')
            .select('*')
            .eq('wallet', walletAddress.toLowerCase())
            .single();

        if (error) {
            console.error('❌ Database error during HR auth:', error);
            if (error.code === 'PGRST116') {
                return res.status(401).json({ error: 'HR user not found' });
            }
            return res.status(500).json({ error: 'Database error' });
        }

        if (!hrUser) {
            return res.status(401).json({ error: 'HR user not found' });
        }

        console.log('✅ HR authentication successful for:', hrUser.email);

        res.json({
            message: 'HR login successful',
            user: {
                id: hrUser.id,
                name: hrUser.name,
                email: hrUser.email,
                wallet: hrUser.wallet
            }
        });
    } catch (error) {
        console.error('HR Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Employee Sign Up
router.post('/employee/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name
                }
            }
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            message: 'Employee signup successful',
            user: data.user
        });
    } catch (error) {
        console.error('Employee Signup Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Employee Login
router.post('/employee/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            message: 'Employee login successful',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        console.error('Employee Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 