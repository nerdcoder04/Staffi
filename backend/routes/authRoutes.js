const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Secret key for JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'staffi-secret-key-replace-in-production';

// Log the JWT_SECRET length (for debugging)
console.log('🔐 authRoutes.js: JWT_SECRET length:', JWT_SECRET ? JWT_SECRET.length : 'undefined');

// Helper function to hash passwords
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Helper function to get role and department IDs
const getRoleAndDepartmentIds = async (roleName, deptName) => {
    // Get role ID
    const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('role_name', roleName.toUpperCase())
        .single();
    
    if (roleError || !roleData) {
        throw new Error(`Invalid role: ${roleName}`);
    }
    
    // Get department ID
    const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('id')
        .eq('dept_name', deptName.toUpperCase())
        .single();
    
    if (deptError || !deptData) {
        throw new Error(`Invalid department: ${deptName}`);
    }
    
    return {
        roleId: roleData.id,
        departmentId: deptData.id
    };
};

// Helper function to get role and department names
const getRoleAndDepartmentNames = async (roleId, deptId) => {
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
    
    return {
        role: roleData?.role_name || 'Unknown',
        department: deptData?.dept_name || 'Unknown'
    };
};

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
        const { email, password, name, role, department } = req.body;

        if (!email || !password || !name || !role || !department) {
            return res.status(400).json({ 
                error: 'Email, password, name, role, and department are required' 
            });
        }

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('employees')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        try {
            // Get role and department IDs
            const { roleId, departmentId } = await getRoleAndDepartmentIds(role, department);

            // Hash the password
            const hashedPassword = hashPassword(password);

            // Insert new employee
            const { data, error } = await supabase
                .from('employees')
                .insert([
                    {
                        name,
                        email,
                        password: hashedPassword,
                        role_id: roleId,
                        department_id: departmentId,
                        doj: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Employee Signup Error:', error);
                return res.status(500).json({ error: error.message || 'Failed to create employee account' });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: data.id, email: data.email, role: 'employee' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Get role and department names for the response
            const { role: roleName, department: deptName } = await getRoleAndDepartmentNames(
                data.role_id, 
                data.department_id
            );
            
            // Remove password from response and add role/department names
            delete data.password;
            data.role = roleName;
            data.department = deptName;

            res.status(201).json({
                message: 'Employee signup successful',
                user: data,
                token
            });
        } catch (validationError) {
            console.error('Validation error:', validationError.message);
            return res.status(400).json({ error: validationError.message });
        }
    } catch (error) {
        console.error('Employee Signup Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Employee Login
router.post('/employee/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('👤 Employee login attempt for:', email);

        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Hash the submitted password
        const hashedPassword = hashPassword(password);
        console.log('🔑 Password hashed for auth attempt');

        // Find employee by email and password
        const { data: employee, error } = await supabase
            .from('employees')
            .select('*')
            .eq('email', email)
            .eq('password', hashedPassword)
            .single();

        if (error) {
            console.log('❌ Database error during login:', error);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!employee) {
            console.log('❌ No employee found with matching credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('✅ Employee found in database with ID:', employee.id);

        // Create JWT token payload
        const tokenPayload = { id: employee.id, email: employee.email, role: 'employee' };
        console.log('📦 JWT payload:', tokenPayload);
        console.log('🔑 JWT secret length:', JWT_SECRET.length);

        // Create JWT token
        const token = jwt.sign(
            tokenPayload,
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('🎟️ JWT token created (first 20 chars):', token.substring(0, 20) + '...');

        // Get role and department names for the response
        const { role, department } = await getRoleAndDepartmentNames(
            employee.role_id, 
            employee.department_id
        );
        
        // Remove password from response and add role/department names
        delete employee.password;
        employee.role = role;
        employee.department = department;

        console.log('🚀 Employee login successful, sending response');
        res.json({
            message: 'Employee login successful',
            user: employee,
            token
        });
    } catch (error) {
        console.error('❌ Employee Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test token verification endpoint (for debugging)
router.post('/verify-token', (req, res) => {
    try {
        const { token } = req.body;
        console.log('🔍 Testing token verification');
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        
        console.log('🪪 Token to verify (first 20 chars):', token.substring(0, 20) + '...');
        console.log('🔐 JWT_SECRET being used (length):', JWT_SECRET.length);
        
        try {
            // First try to decode without verification
            const decoded = jwt.decode(token);
            console.log('📦 Token decoded without verification:', decoded);
            
            // Now verify
            const verified = jwt.verify(token, JWT_SECRET);
            console.log('✅ Token verified successfully!');
            
            return res.status(200).json({
                valid: true,
                payload: verified
            });
        } catch (tokenError) {
            console.error('❌ Token verification failed:', tokenError);
            return res.status(401).json({
                valid: false,
                error: tokenError.message
            });
        }
    } catch (error) {
        console.error('❌ Token verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 