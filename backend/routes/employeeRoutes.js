const express = require('express');
const router = express.Router();
const { authenticateHR, authenticateEmployee } = require('../middleware/authMiddleware');
const { 
    addEmployee, 
    getAllEmployees, 
    getEmployeeById,
    connectWallet,
    disconnectWallet,
    getAllRoles,
    getAllDepartments 
} = require('../controllers/employeeController');

// Get all available roles
router.get('/roles', getAllRoles);

// Get all available departments
router.get('/departments', getAllDepartments);

// Add new employee (HR only)
router.post('/add', authenticateHR, addEmployee);

// Get all employees (HR only)
router.get('/all', authenticateHR, getAllEmployees);

// Get employee by ID (HR only)
router.get('/:id', authenticateHR, getEmployeeById);

// Connect wallet to employee account (Employee only)
router.post('/wallet/connect', authenticateEmployee, connectWallet);

// Disconnect wallet from employee account (Employee only)
router.post('/wallet/disconnect', authenticateEmployee, disconnectWallet);

module.exports = router; 