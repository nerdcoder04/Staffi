const supabase = require('../utils/supabaseClient');
const jwt = require('jsonwebtoken');

// Secret key for JWT tokens (must match the one in authRoutes.js)
const JWT_SECRET = process.env.JWT_SECRET || 'staffi-secret-key-replace-in-production';

const authenticateHR = async (req, res, next) => {
    try {
        const walletAddress = req.headers['x-wallet-address'];
        console.log('🔑 Attempting HR authentication for wallet:', walletAddress);
        
        if (!walletAddress) {
            console.log('❌ No wallet address provided');
            return res.status(401).json({ error: 'Wallet address is required' });
        }

        const { data: hrUser, error } = await supabase
            .from('hr_users')
            .select('*')
            .eq('wallet', walletAddress)
            .single();

        if (error) {
            console.error('❌ Database error during HR auth:', error);
            return res.status(401).json({ error: 'Unauthorized HR access' });
        }

        if (!hrUser) {
            console.log('❌ No HR user found for wallet:', walletAddress);
            return res.status(401).json({ error: 'Unauthorized HR access' });
        }

        console.log('✅ HR authentication successful for:', hrUser.email);
        req.hrUser = hrUser;
        next();
    } catch (error) {
        console.error('❌ HR Authentication Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const authenticateEmployee = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('🔑 Attempting employee authentication');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ No valid authorization header');
            return res.status(401).json({ error: 'Authorization token is required' });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // Verify the JWT token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Get employee details from database
            const { data: employee, error } = await supabase
                .from('employees')
                .select('*')
                .eq('id', decoded.id)
                .single();
                
            if (error || !employee) {
                console.log('❌ No employee found with ID:', decoded.id);
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
            
            // Remove password from employee object
            delete employee.password;
            
            console.log('✅ Employee authentication successful for:', employee.email);
            req.employee = employee;
            next();
        } catch (tokenError) {
            console.error('❌ Token validation error:', tokenError);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('❌ Employee Authentication Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    authenticateHR,
    authenticateEmployee
}; 