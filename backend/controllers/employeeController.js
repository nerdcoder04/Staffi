const supabase = require('../utils/supabaseClient');
const blockchainService = require('../utils/blockchainService');
const Employee = require('../models/Employee');
const logger = require('../utils/logger');

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

// Get all available roles
const getAllRoles = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('id', { ascending: true });
            
        if (error) {
            console.error('❌ Error fetching roles:', error);
            return res.status(500).json({ error: 'Failed to fetch roles' });
        }
        
        res.json({
            message: 'Roles retrieved successfully',
            roles: data
        });
    } catch (error) {
        console.error('❌ Error in getAllRoles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all available departments
const getAllDepartments = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('departments')
            .select('*')
            .order('id', { ascending: true });
            
        if (error) {
            console.error('❌ Error fetching departments:', error);
            return res.status(500).json({ error: 'Failed to fetch departments' });
        }
        
        res.json({
            message: 'Departments retrieved successfully',
            departments: data
        });
    } catch (error) {
        console.error('❌ Error in getAllDepartments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const requestEmployeeSignup = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role || !department) {
            return res.status(400).json({ 
                error: 'Name, email, password, role, and department are required' 
            });
        }

        try {
            // Check if email already exists in employees or requests
            const { data: existingEmployee, error: empError } = await supabase
                .from('employees')
                .select('email')
                .eq('email', email)
                .single();
                
            if (existingEmployee) {
                return res.status(400).json({ error: 'Email already registered as an employee' });
            }
            
            const { data: existingRequest, error: reqError } = await supabase
                .from('employee_requests')
                .select('email, status')
                .eq('email', email)
                .single();
                
            if (existingRequest) {
                if (existingRequest.status === 'PENDING') {
                    return res.status(400).json({ error: 'A signup request for this email is already pending' });
                } else if (existingRequest.status === 'REJECTED') {
                    return res.status(400).json({ error: 'A previous signup request for this email was rejected' });
                }
            }

            // Get role and department IDs
            const { roleId, departmentId } = await getRoleAndDepartmentIds(role, department);
            
            // Hash the password
            const crypto = require('crypto');
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            
            // Create employee request in Supabase
            const { data, error } = await supabase
                .from('employee_requests')
                .insert([
                    {
                        name,
                        email,
                        password: hashedPassword,
                        role_id: roleId,
                        department_id: departmentId,
                        status: 'PENDING'
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error creating employee request:', error);
                return res.status(500).json({ error: 'Failed to create employee request' });
            }

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
                message: 'Employee signup request submitted successfully. Awaiting HR approval.',
                request: data
            });
            
        } catch (validationError) {
            console.error('Validation error:', validationError.message);
            return res.status(400).json({ error: validationError.message });
        }
    } catch (error) {
        console.error('Error in requestEmployeeSignup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Internal function to add an employee from an approved request
const _addEmployee = async (requestData) => {
    try {
        // Create employee in Supabase
        const { data, error } = await supabase
            .from('employees')
            .insert([
                {
                    name: requestData.name,
                    email: requestData.email,
                    password: requestData.password,
                    wallet: null,
                    role_id: requestData.role_id,
                    department_id: requestData.department_id,
                    status: true,
                    doj: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding employee:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error in _addEmployee:', error);
        throw error;
    }
};

// Get all employees (for HR)
const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.findAll();
        res.status(200).json(employees);
    } catch (error) {
        logger.error('Error getting all employees:', error);
        next(error);
    }
};

// Get employee by ID (for HR)
const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.status(200).json(employee);
    } catch (error) {
        logger.error(`Error getting employee with ID ${req.params.id}:`, error);
        next(error);
    }
};

// Get employee's own profile (for employee)
const getEmployeeProfile = async (req, res, next) => {
    try {
        const employee = await Employee.findByPk(req.user.id);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee profile not found' });
        }
        
        res.status(200).json(employee);
    } catch (error) {
        logger.error(`Error getting employee profile for ID ${req.user.id}:`, error);
        next(error);
    }
};

// Connect wallet to employee account
const connectWallet = async (req, res) => {
    try {
        const { walletAddress } = req.body;
        const employeeId = req.employee.id;

        console.log(`🔗 Connecting wallet ${walletAddress} to employee ID: ${employeeId}`);

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
        }

        // Check if wallet is already connected to another employee
        const { data: existingWallet, error: checkError } = await supabase
            .from('employees')
            .select('id, email')
            .eq('wallet', walletAddress.toLowerCase())
            .neq('id', employeeId)
            .single();

        if (existingWallet) {
            return res.status(400).json({ 
                error: `This wallet is already connected to employee: ${existingWallet.email}` 
            });
        }

        // Update employee with wallet address
        const { data, error } = await supabase
            .from('employees')
            .update({ wallet: walletAddress.toLowerCase() })
            .eq('id', employeeId)
            .select()
            .single();

        if (error) {
            console.error('❌ Error connecting wallet:', error);
            return res.status(500).json({ error: 'Failed to connect wallet' });
        }

        // Get role and department names
        const { role, department } = await getRoleAndDepartmentNames(data.role_id, data.department_id);
        
        console.log('✅ Wallet connected successfully for:', data.email);

        // Remove password from response and add role/department names
        delete data.password;
        data.role = role;
        data.department = department;
        
        res.json({
            message: 'Wallet connected successfully',
            employee: data
        });
    } catch (error) {
        console.error('❌ Error in connectWallet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Disconnect wallet from employee account
const disconnectWallet = async (req, res) => {
    try {
        const employeeId = req.employee.id;

        console.log(`🔗 Disconnecting wallet from employee ID: ${employeeId}`);

        // Update employee to remove wallet address
        const { data, error } = await supabase
            .from('employees')
            .update({ wallet: null })
            .eq('id', employeeId)
            .select()
            .single();

        if (error) {
            console.error('❌ Error disconnecting wallet:', error);
            return res.status(500).json({ error: 'Failed to disconnect wallet' });
        }

        // Get role and department names
        const { role, department } = await getRoleAndDepartmentNames(data.role_id, data.department_id);
        
        console.log('✅ Wallet disconnected successfully for:', data.email);

        // Remove password from response and add role/department names
        delete data.password;
        data.role = role;
        data.department = department;
        
        res.json({
            message: 'Wallet disconnected successfully',
            employee: data
        });
    } catch (error) {
        console.error('❌ Error in disconnectWallet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to check if employee exists on blockchain
const checkEmployeeBlockchainStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Employee ID is required' });
        }

        // Get employee details
        const { data: employee, error } = await supabase
            .from('employees')
            .select('id, name')
            .eq('id', id)
            .single();

        if (error || !employee) {
            console.error('❌ Error fetching employee:', error);
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Check blockchain status
        const blockchainStatus = await blockchainService.checkEmployeeExistsOnBlockchain(id);
        
        res.json({
            employeeId: id,
            name: employee.name,
            existsOnBlockchain: blockchainStatus.exists,
            error: blockchainStatus.reason
        });
    } catch (error) {
        console.error('❌ Error checking blockchain status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to manually add employee to blockchain (for existing employees not on blockchain)
const addEmployeeToBlockchain = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Employee ID is required' });
        }

        // Get employee details
        const { data: employee, error } = await supabase
            .from('employees')
            .select(`
                id, 
                name,
                wallet, 
                role_id, 
                department_id, 
                doj
            `)
            .eq('id', id)
            .single();

        if (error || !employee) {
            console.error('❌ Error fetching employee:', error);
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Get role and department names
        const { role, department } = await getRoleAndDepartmentNames(
            employee.role_id, 
            employee.department_id
        );

        // Check if already on blockchain
        const blockchainStatus = await blockchainService.checkEmployeeExistsOnBlockchain(id);
        
        if (blockchainStatus.exists) {
            return res.status(400).json({ 
                error: 'Employee already exists on blockchain',
                employeeId: id,
                name: employee.name
            });
        }

        // Add to blockchain
        const result = await blockchainService.addEmployeeToBlockchain(
            employee.id,
            employee.name,
            employee.wallet,
            role,
            employee.doj,
            department
        );

        if (!result.success) {
            return res.status(503).json({
                error: 'Failed to add employee to blockchain',
                reason: result.reason,
                employeeId: id,
                name: employee.name
            });
        }

        res.json({
            success: true,
            message: 'Employee added to blockchain successfully',
            employeeId: id,
            name: employee.name,
            transaction: result.txHash
        });
    } catch (error) {
        console.error('❌ Error adding to blockchain:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new employee
const createEmployee = async (req, res, next) => {
    try {
        // Create employee in database
        const employee = await Employee.create(req.body);
        
        // Automatically add to blockchain
        let blockchainTxHash = null;
        let blockchainSuccess = false;
        
        try {
            // Get role and department names
            const { role, department } = await getRoleAndDepartmentNames(
                employee.role_id,
                employee.department_id
            );
            
            // Check blockchain availability
            const blockchainAvailable = await blockchainService.isBlockchainAvailable();
            
            if (blockchainAvailable) {
                // Add to blockchain
                const result = await blockchainService.addEmployeeToBlockchain(
                    employee.id,
                    employee.name,
                    employee.wallet || null, // Use wallet if provided
                    role,
                    employee.doj,
                    department
                );
                
                if (result.success) {
                    blockchainTxHash = result.txHash;
                    blockchainSuccess = true;
                    
                    // Update employee record with blockchain transaction
                    await Employee.update(
                        { blockchain_tx: result.txHash },
                        { where: { id: employee.id } }
                    );
                    
                    logger.info(`New employee ${employee.name} added to blockchain: ${blockchainTxHash}`);
                } else {
                    logger.error(`Failed to add employee to blockchain: ${result.reason}`);
                }
            } else {
                logger.warn('Blockchain service unavailable, employee added to database only');
            }
        } catch (blockchainError) {
            logger.error(`Error adding employee to blockchain: ${blockchainError.message}`);
        }
        
        // Respond with employee data and blockchain status
        res.status(201).json({
            employee,
            blockchain: {
                success: blockchainSuccess,
                transaction: blockchainTxHash
            }
        });
    } catch (error) {
        logger.error('Error creating employee:', error);
        
        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map(e => ({ field: e.path, message: e.message })) 
            });
        }
        
        next(error);
    }
};

// Update an employee
const updateEmployee = async (req, res, next) => {
    try {
        // Update employee in database
        const [updated] = await Employee.update(req.body, {
            where: { id: req.params.id },
            returning: true
        });
        
        if (updated === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        const updatedEmployee = await Employee.findByPk(req.params.id);
        
        // Check if employee exists on blockchain and update if needed
        let blockchainStatus = {
            exists: false,
            needsUpdate: false,
            transaction: null
        };
        
        try {
            // Check if employee exists on blockchain
            const existsOnBlockchain = await blockchainService.checkEmployeeExistsOnBlockchain(req.params.id);
            blockchainStatus.exists = existsOnBlockchain.exists;
            
            // If employee doesn't exist on blockchain yet, add them
            if (!existsOnBlockchain.exists) {
                blockchainStatus.needsUpdate = true;
                
                // Get role and department names
                const { role, department } = await getRoleAndDepartmentNames(
                    updatedEmployee.role_id,
                    updatedEmployee.department_id
                );
                
                // Check blockchain availability
                const blockchainAvailable = await blockchainService.isBlockchainAvailable();
                
                if (blockchainAvailable) {
                    // Add to blockchain
                    const result = await blockchainService.addEmployeeToBlockchain(
                        updatedEmployee.id,
                        updatedEmployee.name,
                        updatedEmployee.wallet || null,
                        role,
                        updatedEmployee.doj,
                        department
                    );
                    
                    if (result.success) {
                        blockchainStatus.transaction = result.txHash;
                        
                        // Update employee record with blockchain transaction
                        await Employee.update(
                            { blockchain_tx: result.txHash },
                            { where: { id: updatedEmployee.id } }
                        );
                        
                        logger.info(`Employee ${updatedEmployee.name} added to blockchain during update: ${result.txHash}`);
                    } else {
                        logger.error(`Failed to add employee to blockchain during update: ${result.reason}`);
                    }
                } else {
                    logger.warn('Blockchain service unavailable, employee updated in database only');
                }
            }
        } catch (blockchainError) {
            logger.error(`Error checking/updating blockchain for employee: ${blockchainError.message}`);
        }
        
        res.status(200).json({
            employee: updatedEmployee,
            blockchain: blockchainStatus
        });
    } catch (error) {
        logger.error(`Error updating employee with ID ${req.params.id}:`, error);
        
        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map(e => ({ field: e.path, message: e.message })) 
            });
        }
        
        next(error);
    }
};

// Delete an employee
const deleteEmployee = async (req, res, next) => {
    try {
        const deleted = await Employee.destroy({
            where: { id: req.params.id }
        });
        
        if (deleted === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.status(204).json();
    } catch (error) {
        logger.error(`Error deleting employee with ID ${req.params.id}:`, error);
        next(error);
    }
};

// Update employee profile (for employee)
const updateEmployeeProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const updates = {};
        
        if (name) updates.name = name;
        if (email) updates.email = email;
        
        const [updated] = await Employee.update(updates, {
            where: { id: req.user.id },
            returning: true
        });
        
        if (updated === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        const updatedEmployee = await Employee.findByPk(req.user.id);
        res.status(200).json({
            message: 'Profile updated successfully',
            employee: updatedEmployee
        });
    } catch (error) {
        logger.error(`Error updating employee profile for ID ${req.user.id}:`, error);
        next(error);
    }
};

// Update employee wallet (for employee)
const updateEmployeeWallet = async (req, res, next) => {
    try {
        const { wallet } = req.body;
        
        if (!wallet) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }
        
        const [updated] = await Employee.update({ wallet }, {
            where: { id: req.user.id },
            returning: true
        });
        
        if (updated === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        const updatedEmployee = await Employee.findByPk(req.user.id);
        res.status(200).json({
            message: 'Wallet updated successfully',
            employee: updatedEmployee
        });
    } catch (error) {
        logger.error(`Error updating wallet for employee ID ${req.user.id}:`, error);
        next(error);
    }
};

// Get all employee requests (for HR)
const getAllEmployeeRequests = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = supabase
            .from('employee_requests')
            .select(`
                *,
                roles(role_name),
                departments(dept_name)
            `);
            
        if (status) {
            query = query.eq('status', status.toUpperCase());
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
            
        if (error) {
            console.error('Error fetching employee requests:', error);
            return res.status(500).json({ error: 'Failed to fetch employee requests' });
        }
        
        const formattedRequests = data.map(request => ({
            id: request.id,
            name: request.name,
            email: request.email,
            role_id: request.role_id,
            role_name: request.roles?.role_name,
            department_id: request.department_id,
            department_name: request.departments?.dept_name,
            status: request.status,
            created_at: request.created_at,
            approved_by: request.approved_by,
            approved_at: request.approved_at,
            rejection_reason: request.rejection_reason
        }));
        
        res.json({
            message: 'Employee requests retrieved successfully',
            requests: formattedRequests
        });
    } catch (error) {
        console.error('Error in getAllEmployeeRequests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Approve employee request (for HR)
const approveEmployeeRequest = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Request ID is required' });
        }
        
        // Check if request exists and is pending
        const { data: request, error: requestError } = await supabase
            .from('employee_requests')
            .select('*')
            .eq('id', id)
            .single();
            
        if (requestError || !request) {
            console.error('Error fetching request:', requestError);
            return res.status(404).json({ error: 'Request not found' });
        }
        
        if (request.status !== 'PENDING') {
            return res.status(400).json({ 
                error: `Request already ${request.status.toLowerCase()}`,
                status: request.status 
            });
        }
        
        // Update request status
        const { data: updatedRequest, error: updateError } = await supabase
            .from('employee_requests')
            .update({
                status: 'APPROVED',
                approved_by: req.user.id,
                approved_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
            
        if (updateError) {
            console.error('Error updating request:', updateError);
            return res.status(500).json({ error: 'Failed to approve request' });
        }
        
        // Create employee from request data
        const employee = await _addEmployee(request);
        
        // Get role and department names for blockchain
        const { role, department } = await getRoleAndDepartmentNames(
            request.role_id, 
            request.department_id
        );
        
        // Automatically add to blockchain
        let blockchainTxHash = null;
        let blockchainSuccess = false;
        
        try {
            // Check blockchain availability
            const blockchainAvailable = await blockchainService.isBlockchainAvailable();
            
            if (blockchainAvailable) {
                // Add to blockchain
                const result = await blockchainService.addEmployeeToBlockchain(
                    employee.id,
                    employee.name,
                    null, // No wallet initially
                    role,
                    employee.doj,
                    department
                );
                
                if (result.success) {
                    blockchainTxHash = result.txHash;
                    blockchainSuccess = true;
                    
                    // Update employee record with blockchain transaction
                    await supabase
                        .from('employees')
                        .update({ blockchain_tx: result.txHash })
                        .eq('id', employee.id);
                    
                    console.log(`✅ New employee ${employee.name} added to blockchain: ${blockchainTxHash}`);
                } else {
                    console.error('❌ Failed to add employee to blockchain:', result.reason);
                }
            } else {
                console.warn('⚠️ Blockchain service unavailable, employee added to database only');
            }
        } catch (blockchainError) {
            console.error('❌ Error adding employee to blockchain:', blockchainError);
        }
        
        res.json({
            message: 'Employee request approved successfully',
            request: updatedRequest,
            employee,
            blockchain: {
                success: blockchainSuccess,
                transaction: blockchainTxHash
            }
        });
    } catch (error) {
        console.error('Error in approveEmployeeRequest:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Reject employee request (for HR)
const rejectEmployeeRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        if (!id) {
            return res.status(400).json({ error: 'Request ID is required' });
        }
        
        // Check if request exists and is pending
        const { data: request, error: requestError } = await supabase
            .from('employee_requests')
            .select('*')
            .eq('id', id)
            .single();
            
        if (requestError || !request) {
            console.error('Error fetching request:', requestError);
            return res.status(404).json({ error: 'Request not found' });
        }
        
        if (request.status !== 'PENDING') {
            return res.status(400).json({ 
                error: `Request already ${request.status.toLowerCase()}`,
                status: request.status 
            });
        }
        
        // Update request status
        const { data: updatedRequest, error: updateError } = await supabase
            .from('employee_requests')
            .update({
                status: 'REJECTED',
                rejected_by: req.user.id,
                rejected_at: new Date().toISOString(),
                rejection_reason: reason
            })
            .eq('id', id)
            .select()
            .single();
            
        if (updateError) {
            console.error('Error updating request:', updateError);
            return res.status(500).json({ error: 'Failed to reject request' });
        }
        
        res.json({
            message: 'Employee request rejected successfully',
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error in rejectEmployeeRequest:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update employee blockchain wallet (for HR)
const updateEmployeeBlockchainWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const { wallet } = req.body;
        
        if (!id) {
            return res.status(400).json({ error: 'Employee ID is required' });
        }
        
        if (!wallet) {
            return res.status(400).json({ error: 'Wallet address is required' });
        }
        
        // Check if employee exists
        const { data: employee, error: employeeError } = await supabase
            .from('employees')
            .select('id, name')
            .eq('id', id)
            .single();
            
        if (employeeError || !employee) {
            console.error('Error fetching employee:', employeeError);
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        // Check if employee exists on blockchain first
        const blockchainStatus = await blockchainService.checkEmployeeExistsOnBlockchain(id);
        
        if (!blockchainStatus.exists) {
            return res.status(400).json({ 
                error: 'Employee must be added to blockchain first',
                employeeId: id,
                name: employee.name
            });
        }
        
        // Update wallet on blockchain
        const result = await blockchainService.updateEmployeeWallet(id, wallet);
        
        if (!result.success) {
            return res.status(503).json({
                error: 'Failed to update employee wallet on blockchain',
                reason: result.reason,
                employeeId: id,
                name: employee.name
            });
        }
        
        // Update wallet in database
        const { data: updatedEmployee, error: updateError } = await supabase
            .from('employees')
            .update({ wallet })
            .eq('id', id)
            .select()
            .single();
            
        if (updateError) {
            console.error('Error updating employee wallet:', updateError);
            return res.status(500).json({ error: 'Failed to update employee wallet in database' });
        }
        
        res.json({
            success: true,
            message: 'Employee wallet updated successfully on blockchain and in database',
            employeeId: id,
            name: employee.name,
            wallet,
            transaction: result.txHash
        });
    } catch (error) {
        console.error('Error updating employee wallet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllRoles,
    getAllDepartments,
    requestEmployeeSignup,
    getAllEmployees,
    getEmployeeById,
    getEmployeeProfile,
    updateEmployeeProfile,
    updateEmployeeWallet,
    getAllEmployeeRequests,
    approveEmployeeRequest,
    rejectEmployeeRequest,
    connectWallet,
    disconnectWallet,
    checkEmployeeBlockchainStatus,
    addEmployeeToBlockchain,
    updateEmployeeBlockchainWallet,
    _addEmployee, // Export for internal use in HR controller
    createEmployee,
    updateEmployee,
    deleteEmployee
}; 