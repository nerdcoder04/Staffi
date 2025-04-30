/**
 * Main application entry point
 */

// Load environment variables first
require('./utils/env').loadEnv();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./utils/logger');
const supabase = require('./utils/supabaseClient');

// Import routes from existing codebase
const authRoutes = require('./routes/authRoutes');
const hrRoutes = require('./routes/hrRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const employeeStatusRoutes = require('./routes/employeeStatusRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const { authenticateHR, authenticateEmployee } = require('./middleware/authMiddleware');

// Create Express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging
app.use(morgan('combined', { 
  stream: { 
    write: message => logger.info(message.trim()) 
  } 
}));

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    // Simple query to test connection
    const { data, error } = await supabase.from('employees').select('count()', { count: 'exact', head: true });
    
    if (error) throw error;
    
    logger.info('Supabase connection established successfully.');
  } catch (error) {
    logger.error('Unable to connect to Supabase:', error);
  }
};

// Test connection if not in test mode
if (process.env.NODE_ENV !== 'test') {
  testSupabaseConnection();
}

// Register routes (use existing route patterns)
app.use('/api/auth', authRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/employee-status', employeeStatusRoutes);
app.use('/api/payroll', payrollRoutes);

// Protected Routes for Testing
app.get('/api/protected/hr-route', authenticateHR, (req, res) => {
  res.status(200).json({ message: 'HR access granted' });
});

app.get('/api/protected/employee-route', authenticateEmployee, (req, res) => {
  res.status(200).json({ message: 'Employee access granted' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app; 