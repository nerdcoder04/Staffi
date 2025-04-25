const supabase = require('../utils/supabaseClient');

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
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            console.error('❌ Token validation error:', error);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        if (!user) {
            console.log('❌ No user found for token');
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        console.log('✅ Employee authentication successful for:', user.email);
        req.employee = user;
        next();
    } catch (error) {
        console.error('❌ Employee Authentication Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    authenticateHR,
    authenticateEmployee
}; 