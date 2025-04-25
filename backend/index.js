const express = require('express');
const cors = require('cors');
const { authenticateHR, authenticateEmployee } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const hrRoutes = require('./routes/hrRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const supabase = require('./utils/supabaseClient');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/employee', employeeRoutes);

// Protected Routes for Testing
app.get('/api/protected/hr-route', authenticateHR, (req, res) => {
    res.status(200).json({ message: 'HR access granted' });
});

app.get('/api/protected/employee-route', authenticateEmployee, (req, res) => {
    res.status(200).json({ message: 'Employee access granted' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
