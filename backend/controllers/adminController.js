const supabase = require('../utils/supabaseClient');

// =========== ROLE MANAGEMENT ===========

// Get all roles
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

// Create new role
const createRole = async (req, res) => {
    try {
        const { role_name, description } = req.body;
        
        if (!role_name) {
            return res.status(400).json({ error: 'Role name is required' });
        }
        
        // Convert role name to uppercase
        const formattedRoleName = role_name.toUpperCase().trim();
        
        // Check if role already exists
        const { data: existingRole, error: checkError } = await supabase
            .from('roles')
            .select('role_name')
            .eq('role_name', formattedRoleName)
            .single();
            
        if (existingRole) {
            return res.status(400).json({ error: 'Role already exists' });
        }
        
        // Create the role
        const { data, error } = await supabase
            .from('roles')
            .insert([
                {
                    role_name: formattedRoleName,
                    description: description || null
                }
            ])
            .select()
            .single();
            
        if (error) {
            console.error('❌ Error creating role:', error);
            return res.status(500).json({ error: 'Failed to create role' });
        }
        
        res.status(201).json({
            message: 'Role created successfully',
            role: data
        });
    } catch (error) {
        console.error('❌ Error in createRole:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update role
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_name, description } = req.body;
        
        if (!id) {
            return res.status(400).json({ error: 'Role ID is required' });
        }
        
        // Check if role exists
        const { data: existingRole, error: checkError } = await supabase
            .from('roles')
            .select('*')
            .eq('id', id)
            .single();
            
        if (!existingRole) {
            return res.status(404).json({ error: 'Role not found' });
        }
        
        // Prepare update data
        const updateData = {};
        if (role_name) {
            updateData.role_name = role_name.toUpperCase().trim();
            
            // Check if the new role name already exists (if changing)
            if (updateData.role_name !== existingRole.role_name) {
                const { data: duplicateRole, error: dupCheckError } = await supabase
                    .from('roles')
                    .select('role_name')
                    .eq('role_name', updateData.role_name)
                    .single();
                    
                if (duplicateRole) {
                    return res.status(400).json({ error: 'Another role with this name already exists' });
                }
            }
        }
        
        if (description !== undefined) {
            updateData.description = description;
        }
        
        // If no fields to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        // Update the role
        const { data, error } = await supabase
            .from('roles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
            
        if (error) {
            console.error('❌ Error updating role:', error);
            return res.status(500).json({ error: 'Failed to update role' });
        }
        
        res.json({
            message: 'Role updated successfully',
            role: data
        });
    } catch (error) {
        console.error('❌ Error in updateRole:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete role
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Role ID is required' });
        }
        
        // Check if role exists
        const { data: existingRole, error: checkError } = await supabase
            .from('roles')
            .select('*')
            .eq('id', id)
            .single();
            
        if (!existingRole) {
            return res.status(404).json({ error: 'Role not found' });
        }
        
        // Check if role is in use by any employees
        const { data: employeesWithRole, error: employeeCheckError } = await supabase
            .from('employees')
            .select('id')
            .eq('role_id', id);
            
        if (employeesWithRole && employeesWithRole.length > 0) {
            return res.status(400).json({ 
                error: 'Cannot delete role as it is assigned to employees',
                count: employeesWithRole.length
            });
        }
        
        // Delete the role
        const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', id);
            
        if (error) {
            console.error('❌ Error deleting role:', error);
            return res.status(500).json({ error: 'Failed to delete role' });
        }
        
        res.json({
            message: 'Role deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error in deleteRole:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// =========== DEPARTMENT MANAGEMENT ===========

// Get all departments
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

// Create new department
const createDepartment = async (req, res) => {
    try {
        const { dept_name, description } = req.body;
        
        if (!dept_name) {
            return res.status(400).json({ error: 'Department name is required' });
        }
        
        // Convert department name to uppercase
        const formattedDeptName = dept_name.toUpperCase().trim();
        
        // Check if department already exists
        const { data: existingDept, error: checkError } = await supabase
            .from('departments')
            .select('dept_name')
            .eq('dept_name', formattedDeptName)
            .single();
            
        if (existingDept) {
            return res.status(400).json({ error: 'Department already exists' });
        }
        
        // Create the department
        const { data, error } = await supabase
            .from('departments')
            .insert([
                {
                    dept_name: formattedDeptName,
                    description: description || null
                }
            ])
            .select()
            .single();
            
        if (error) {
            console.error('❌ Error creating department:', error);
            return res.status(500).json({ error: 'Failed to create department' });
        }
        
        res.status(201).json({
            message: 'Department created successfully',
            department: data
        });
    } catch (error) {
        console.error('❌ Error in createDepartment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update department
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { dept_name, description } = req.body;
        
        if (!id) {
            return res.status(400).json({ error: 'Department ID is required' });
        }
        
        // Check if department exists
        const { data: existingDept, error: checkError } = await supabase
            .from('departments')
            .select('*')
            .eq('id', id)
            .single();
            
        if (!existingDept) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        // Prepare update data
        const updateData = {};
        if (dept_name) {
            updateData.dept_name = dept_name.toUpperCase().trim();
            
            // Check if the new department name already exists (if changing)
            if (updateData.dept_name !== existingDept.dept_name) {
                const { data: duplicateDept, error: dupCheckError } = await supabase
                    .from('departments')
                    .select('dept_name')
                    .eq('dept_name', updateData.dept_name)
                    .single();
                    
                if (duplicateDept) {
                    return res.status(400).json({ error: 'Another department with this name already exists' });
                }
            }
        }
        
        if (description !== undefined) {
            updateData.description = description;
        }
        
        // If no fields to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        // Update the department
        const { data, error } = await supabase
            .from('departments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
            
        if (error) {
            console.error('❌ Error updating department:', error);
            return res.status(500).json({ error: 'Failed to update department' });
        }
        
        res.json({
            message: 'Department updated successfully',
            department: data
        });
    } catch (error) {
        console.error('❌ Error in updateDepartment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete department
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Department ID is required' });
        }
        
        // Check if department exists
        const { data: existingDept, error: checkError } = await supabase
            .from('departments')
            .select('*')
            .eq('id', id)
            .single();
            
        if (!existingDept) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        // Check if department is in use by any employees
        const { data: employeesWithDept, error: employeeCheckError } = await supabase
            .from('employees')
            .select('id')
            .eq('department_id', id);
            
        if (employeesWithDept && employeesWithDept.length > 0) {
            return res.status(400).json({ 
                error: 'Cannot delete department as it is assigned to employees',
                count: employeesWithDept.length
            });
        }
        
        // Delete the department
        const { error } = await supabase
            .from('departments')
            .delete()
            .eq('id', id);
            
        if (error) {
            console.error('❌ Error deleting department:', error);
            return res.status(500).json({ error: 'Failed to delete department' });
        }
        
        res.json({
            message: 'Department deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error in deleteDepartment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    // Role endpoints
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    
    // Department endpoints
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
}; 