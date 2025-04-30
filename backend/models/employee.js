const supabase = require('../utils/supabaseClient');
const logger = require('../utils/logger');

class Employee {
    /**
     * Find all employees
     * @returns {Promise<Array>} List of employees
     */
    static async findAll() {
        try {
            const { data, error } = await supabase
                .from('employees')
                .select(`
                    id,
                    name,
                    email,
                    wallet,
                    role_id,
                    department_id,
                    status,
                    doj
                `)
                .order('id', { ascending: true });

            if (error) throw error;
            
            return data;
        } catch (error) {
            logger.error('Error in Employee.findAll:', error);
            throw error;
        }
    }
    
    /**
     * Find employee by primary key
     * @param {number} id - The employee ID
     * @returns {Promise<Object>} Employee data
     */
    static async findByPk(id) {
        try {
            const { data, error } = await supabase
                .from('employees')
                .select(`
                    id,
                    name,
                    email,
                    wallet,
                    role_id,
                    department_id,
                    status,
                    doj
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            
            return data;
        } catch (error) {
            logger.error(`Error in Employee.findByPk(${id}):`, error);
            throw error;
        }
    }
    
    /**
     * Create a new employee
     * @param {Object} employeeData - The employee data
     * @returns {Promise<Object>} Created employee
     */
    static async create(employeeData) {
        try {
            const { data, error } = await supabase
                .from('employees')
                .insert([employeeData])
                .select()
                .single();

            if (error) throw error;
            
            return data;
        } catch (error) {
            logger.error('Error in Employee.create:', error);
            throw error;
        }
    }
    
    /**
     * Update an employee
     * @param {Object} updateData - The data to update
     * @param {Object} options - Options with where condition
     * @returns {Promise<Array>} Array with count of updated rows
     */
    static async update(updateData, options) {
        try {
            const { data, error } = await supabase
                .from('employees')
                .update(updateData)
                .eq('id', options.where.id)
                .select();

            if (error) throw error;
            
            return [data ? data.length : 0];
        } catch (error) {
            logger.error(`Error in Employee.update for ID ${options?.where?.id}:`, error);
            throw error;
        }
    }
    
    /**
     * Delete an employee
     * @param {Object} options - Options with where condition
     * @returns {Promise<number>} Count of deleted rows
     */
    static async destroy(options) {
        try {
            const { data, error } = await supabase
                .from('employees')
                .delete()
                .eq('id', options.where.id);

            if (error) throw error;
            
            return 1; // Supabase doesn't return deleted count, so we assume 1 if no error
        } catch (error) {
            logger.error(`Error in Employee.destroy for ID ${options?.where?.id}:`, error);
            throw error;
        }
    }
    
    /**
     * Find employee by wallet address
     * @param {string} walletAddress - The wallet address
     * @returns {Promise<Object>} Employee data
     */
    static async findByWallet(walletAddress) {
        try {
            const { data, error } = await supabase
                .from('employees')
                .select(`
                    id,
                    name,
                    email,
                    wallet,
                    role_id,
                    department_id,
                    status,
                    doj
                `)
                .eq('wallet', walletAddress)
                .single();

            if (error) throw error;
            
            return data;
        } catch (error) {
            logger.error(`Error in Employee.findByWallet(${walletAddress}):`, error);
            throw error;
        }
    }
    
    /**
     * Find employee by email
     * @param {string} email - The employee email
     * @returns {Promise<Object>} Employee data
     */
    static async findByEmail(email) {
        try {
            const { data, error } = await supabase
                .from('employees')
                .select(`
                    id,
                    name,
                    email,
                    wallet,
                    role_id,
                    department_id,
                    status,
                    doj
                `)
                .eq('email', email)
                .single();

            if (error) throw error;
            
            return data;
        } catch (error) {
            logger.error(`Error in Employee.findByEmail(${email}):`, error);
            throw error;
        }
    }
}

module.exports = Employee; 