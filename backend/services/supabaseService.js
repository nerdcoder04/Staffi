const supabase = require('../utils/supabaseClient');
const logger = require('../utils/logger');

/**
 * Core Supabase service for centralized database operations
 */
class SupabaseService {
    /**
     * Generic method to fetch records from a table
     * @param {string} table - The table name
     * @param {Object} options - Query options
     * @returns {Promise<Array>} List of records
     */
    static async findAll(table, options = {}) {
        try {
            let query = supabase.from(table).select(options.select || '*');
            
            // Apply filters if provided
            if (options.filters) {
                for (const [field, value] of Object.entries(options.filters)) {
                    query = query.eq(field, value);
                }
            }
            
            // Apply ordering if provided
            if (options.orderBy) {
                query = query.order(options.orderBy.column, { 
                    ascending: options.orderBy.ascending !== false 
                });
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Error in SupabaseService.findAll(${table}):`, error);
            throw error;
        }
    }
    
    /**
     * Find a record by primary key
     * @param {string} table - The table name
     * @param {string|number} id - The record ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Record data
     */
    static async findByPk(table, id, options = {}) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select(options.select || '*')
                .eq('id', id)
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Error in SupabaseService.findByPk(${table}, ${id}):`, error);
            throw error;
        }
    }
    
    /**
     * Create a new record
     * @param {string} table - The table name
     * @param {Object} recordData - The record data
     * @returns {Promise<Object>} Created record
     */
    static async create(table, recordData) {
        try {
            const { data, error } = await supabase
                .from(table)
                .insert([recordData])
                .select()
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Error in SupabaseService.create(${table}):`, error);
            throw error;
        }
    }
    
    /**
     * Update a record
     * @param {string} table - The table name
     * @param {string|number} id - The record ID
     * @param {Object} updateData - The data to update
     * @returns {Promise<Object>} Updated record
     */
    static async update(table, id, updateData) {
        try {
            const { data, error } = await supabase
                .from(table)
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Error in SupabaseService.update(${table}, ${id}):`, error);
            throw error;
        }
    }
    
    /**
     * Delete a record
     * @param {string} table - The table name
     * @param {string|number} id - The record ID
     * @returns {Promise<boolean>} Success status
     */
    static async delete(table, id) {
        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id);
                
            if (error) throw error;
            return true;
        } catch (error) {
            logger.error(`Error in SupabaseService.delete(${table}, ${id}):`, error);
            throw error;
        }
    }
    
    /**
     * Find records by a field/value pair
     * @param {string} table - The table name
     * @param {string} field - The field name to search by
     * @param {any} value - The field value to match
     * @param {Object} options - Additional query options
     * @returns {Promise<Array|Object>} Records matching the query
     */
    static async findBy(table, field, value, options = {}) {
        try {
            let query = supabase
                .from(table)
                .select(options.select || '*')
                .eq(field, value);
                
            if (options.single) {
                query = query.single();
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Error in SupabaseService.findBy(${table}, ${field}, ${value}):`, error);
            throw error;
        }
    }
    
    /**
     * Raw SQL query for complex operations
     * @param {string} query - SQL query string
     * @param {Array} params - Query parameters
     * @returns {Promise<Object>} Query result
     */
    static async rawQuery(query, params = []) {
        try {
            const { data, error } = await supabase.rpc('execute_sql', {
                query_text: query,
                query_params: params
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Error in SupabaseService.rawQuery:`, error);
            throw error;
        }
    }
}

module.exports = SupabaseService; 