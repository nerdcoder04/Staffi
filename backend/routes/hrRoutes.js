const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const { authenticateHR } = require('../middleware/authMiddleware');
const employeeController = require('../controllers/employeeController');

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

// Get all employee signup requests (HR only)
router.get('/employee-requests', authenticateHR, async (req, res) => {
    try {
        console.log('🔍 Fetching employee signup requests...');
        
        const { data, error } = await supabase
            .from('employee_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Database error:', error);
            throw error;
        }

        // Get role and department details for each request
        const requests = await Promise.all(data.map(async (request) => {
            // Get role name
            const { data: roleData } = await supabase
                .from('roles')
                .select('role_name')
                .eq('id', request.role_id)
                .single();
            
            // Get department name
            const { data: deptData } = await supabase
                .from('departments')
                .select('dept_name')
                .eq('id', request.department_id)
                .single();
            
            // Remove password from response
            const { password, ...requestWithoutPassword } = request;
            
            return {
                ...requestWithoutPassword,
                role: roleData?.role_name || 'Unknown',
                department: deptData?.dept_name || 'Unknown'
            };
        }));

        console.log(`📋 Found ${requests.length} employee signup requests`);

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('❌ Error in employee-requests endpoint:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch employee requests'
        });
    }
});

// Approve employee signup request (HR only)
router.post('/employee-requests/:id/approve', authenticateHR, async (req, res) => {
    try {
        const { id } = req.params;
        const hrUserId = req.hrUser.id;

        // Get the request
        const { data: request, error: requestError } = await supabase
            .from('employee_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (requestError || !request) {
            console.error('❌ Request not found:', requestError);
            return res.status(404).json({ error: 'Employee request not found' });
        }

        // Check if already processed
        if (request.status !== 'PENDING') {
            return res.status(400).json({ 
                error: `Request already ${request.status.toLowerCase()}`
            });
        }

        // Get role and department names for blockchain record
        const { data: roleData } = await supabase
            .from('roles')
            .select('role_name')
            .eq('id', request.role_id)
            .single();
            
        const { data: deptData } = await supabase
            .from('departments')
            .select('dept_name')
            .eq('id', request.department_id)
            .single();

        const role = roleData?.role_name || 'Unknown';
        const department = deptData?.dept_name || 'Unknown';

        // Check blockchain availability before starting database operations
        const blockchainService = require('../utils/blockchainService');
        const blockchainAvailable = await blockchainService.isBlockchainAvailable();
        
        if (!blockchainAvailable && process.env.NODE_ENV !== 'test') {
            console.error('❌ Blockchain not available - employee creation canceled');
            return res.status(503).json({
                error: 'Blockchain service unavailable. Employee creation canceled.',
                details: 'Contact administrator to ensure proper blockchain configuration.'
            });
        }

        // Start a transaction 
        try {
            // Import the internal _addEmployee function
            const { _addEmployee } = require('../controllers/employeeController');
            
            // Add employee from request data
            const newEmployee = await _addEmployee(request);
            
            // Add employee to blockchain
            const blockchainResult = await blockchainService.addEmployeeToBlockchain(
                newEmployee.id,
                newEmployee.name,
                newEmployee.wallet,
                role,
                newEmployee.doj,
                department
            );

            if (!blockchainResult.success && process.env.NODE_ENV !== 'test') {
                // If blockchain operation failed, delete the employee from database
                console.error('❌ Blockchain operation failed:', blockchainResult.reason);
                
                // Delete the employee from database since blockchain operation failed
                await supabase
                    .from('employees')
                    .delete()
                    .eq('id', newEmployee.id);
                
                return res.status(503).json({
                    error: 'Blockchain transaction failed. Employee not created.',
                    details: blockchainResult.reason
                });
            }
            
            // Update request status
            const { data: updatedRequest, error: updateError } = await supabase
                .from('employee_requests')
                .update({
                    status: 'APPROVED',
                    approved_by: hrUserId,
                    approved_at: new Date().toISOString(),
                    blockchain_tx: blockchainResult.txHash
                })
                .eq('id', id)
                .select()
                .single();
                
            if (updateError) {
                throw updateError;
            }
            
            console.log('✅ Employee request approved and employee created successfully');
            console.log(blockchainResult.txHash ? 
                        `✅ Employee added to blockchain, tx: ${blockchainResult.txHash}` : 
                        '⚠️ Employee added to database only (test mode)');
            
            // Remove sensitive data
            delete newEmployee.password;
            
            res.status(200).json({
                success: true,
                message: 'Employee request approved and account created',
                employee: {
                    ...newEmployee,
                    role: role,
                    department: department
                },
                blockchain_tx: blockchainResult.txHash
            });
            
        } catch (error) {
            console.error('❌ Error in approval process:', error);
            throw error;
        }
    } catch (error) {
        console.error('❌ Error in approval endpoint:', error);
        res.status(500).json({
            error: error.message || 'Failed to approve employee request'
        });
    }
});

// Reject employee signup request (HR only)
router.post('/employee-requests/:id/reject', authenticateHR, async (req, res) => {
    try {
        const { id } = req.params;
        const hrUserId = req.hrUser.id;
        const { reason } = req.body;

        // Get the request
        const { data: request, error: requestError } = await supabase
            .from('employee_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (requestError || !request) {
            console.error('❌ Request not found:', requestError);
            return res.status(404).json({ error: 'Employee request not found' });
        }

        // Check if already processed
        if (request.status !== 'PENDING') {
            return res.status(400).json({ 
                error: `Request already ${request.status.toLowerCase()}`
            });
        }

        // Update request status
        const { data: updatedRequest, error: updateError } = await supabase
            .from('employee_requests')
            .update({
                status: 'REJECTED',
                approved_by: hrUserId,
                approved_at: new Date().toISOString(),
                rejection_reason: reason || 'No reason provided'
            })
            .eq('id', id)
            .select()
            .single();
            
        if (updateError) {
            console.error('❌ Error updating request:', updateError);
            throw updateError;
        }
        
        console.log('✅ Employee request rejected');
        
        res.status(200).json({
            success: true,
            message: 'Employee request rejected',
            request: {
                id: updatedRequest.id,
                email: updatedRequest.email,
                status: updatedRequest.status
            }
        });
        
    } catch (error) {
        console.error('❌ Error in rejection endpoint:', error);
        res.status(500).json({
            error: error.message || 'Failed to reject employee request'
        });
    }
});

// Check employee blockchain status (HR only)
router.get('/employee/:id/blockchain-status', authenticateHR, employeeController.checkEmployeeBlockchainStatus);

// Add employee to blockchain manually (HR only)
router.post('/employee/:id/add-to-blockchain', authenticateHR, employeeController.addEmployeeToBlockchain);

module.exports = router; 