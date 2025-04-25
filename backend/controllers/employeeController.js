const supabase = require('../utils/supabaseClient');

const addEmployee = async (req, res) => {
    try {
        const { name, email, wallet, role, department } = req.body;

        // Validate required fields
        if (!name || !email || !role || !department) {
            return res.status(400).json({ error: 'Name, email, role, and department are required' });
        }

        // Create employee in Supabase
        const { data, error } = await supabase
            .from('employees')
            .insert([
                {
                    name,
                    email,
                    wallet: wallet || null,
                    role,
                    department,
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

        res.status(201).json({
            message: 'Employee added successfully',
            employee: data
        });
    } catch (error) {
        console.error('Error in addEmployee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addEmployee
}; 