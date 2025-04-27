const supabase = require('../utils/supabaseClient');

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

const addEmployee = async (req, res) => {
    try {
        const { name, email, password, wallet, role, department } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role || !department) {
            return res.status(400).json({ 
                error: 'Name, email, password, role, and department are required' 
            });
        }

        try {
            // Get role and department IDs
            const { roleId, departmentId } = await getRoleAndDepartmentIds(role, department);
            
            // Hash the password
            const crypto = require('crypto');
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            
            // Create employee in Supabase
            const { data, error } = await supabase
                .from('employees')
                .insert([
                    {
                        name,
                        email,
                        password: hashedPassword,
                        wallet: wallet || null,
                        role_id: roleId,
                        department_id: departmentId,
                        status: true,
                        doj: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error adding employee:', error);
                return res.status(500).json({ error: 'Failed to add employee' });
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
                message: 'Employee added successfully',
                employee: data
            });
            
        } catch (validationError) {
            console.error('Validation error:', validationError.message);
            return res.status(400).json({ error: validationError.message });
        }
    } catch (error) {
        console.error('Error in addEmployee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all employees (for HR)
const getAllEmployees = async (req, res) => {
    try {
        console.log('📊 Fetching all employees from database...');
        
        // Join with roles and departments tables to get names
        const { data, error } = await supabase
            .from('employees')
            .select(`
                id, 
                name, 
                email, 
                wallet, 
                role_id, 
                department_id, 
                doj, 
                status, 
                created_at, 
                updated_at
            `);

        if (error) {
            console.error('❌ Database error:', error);
            return res.status(500).json({ error: 'Failed to fetch employees' });
        }

        // For each employee, get their role and department names
        const employeesWithDetails = await Promise.all(data.map(async (emp) => {
            const { role, department } = await getRoleAndDepartmentNames(emp.role_id, emp.department_id);
            return {
                ...emp,
                role,
                department
            };
        }));

        console.log(`✅ Successfully fetched ${data.length} employees`);
        
        res.json({
            message: 'Employees retrieved successfully',
            employees: employeesWithDetails
        });
    } catch (error) {
        console.error('❌ Error in getAllEmployees:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get employee by ID (for HR)
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🔍 Fetching employee with ID: ${id}`);
        
        if (!id) {
            return res.status(400).json({ error: 'Employee ID is required' });
        }

        const { data, error } = await supabase
            .from('employees')
            .select(`
                id, 
                name, 
                email, 
                wallet, 
                role_id, 
                department_id, 
                doj, 
                status, 
                created_at, 
                updated_at
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('❌ Database error:', error);
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Employee not found' });
            }
            return res.status(500).json({ error: 'Failed to fetch employee' });
        }

        // Get role and department names
        const { role, department } = await getRoleAndDepartmentNames(data.role_id, data.department_id);
        
        // Add role and department names to the response
        const employeeWithDetails = {
            ...data,
            role,
            department
        };

        console.log('✅ Employee found:', data.name);
        
        res.json({
            message: 'Employee retrieved successfully',
            employee: employeeWithDetails
        });
    } catch (error) {
        console.error('❌ Error in getEmployeeById:', error);
        res.status(500).json({ error: 'Internal server error' });
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

module.exports = {
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    connectWallet,
    disconnectWallet,
    getAllRoles,
    getAllDepartments
}; 