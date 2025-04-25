const express = require('express');
const router = express.Router();
const { authenticateHR } = require('../middleware/authMiddleware');
const { addEmployee } = require('../controllers/employeeController');

// Add new employee (HR only)
router.post('/add', authenticateHR, addEmployee);

module.exports = router; 