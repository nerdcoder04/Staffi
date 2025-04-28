/**
 * Employee routes
 */

const express = require('express');
const router = express.Router();
const { authenticateHR, authenticateEmployee } = require('../middleware/authMiddleware');
const { 
    getAllEmployees, 
    getEmployeeById,
    connectWallet,
    disconnectWallet,
    getAllRoles,
    getAllDepartments,
    requestEmployeeSignup,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');

// Get all available roles
router.get('/roles', getAllRoles);

// Get all available departments
router.get('/departments', getAllDepartments);

// Request new employee signup (public route)
router.post('/request', requestEmployeeSignup);

// Get all employees (HR only)
router.get('/all', authenticateHR, getAllEmployees);

// Get employee by ID (HR only)
router.get('/:id', authenticateHR, getEmployeeById);

// Connect wallet to employee account (Employee only)
router.post('/wallet/connect', authenticateEmployee, connectWallet);

// Disconnect wallet from employee account (Employee only)
router.post('/wallet/disconnect', authenticateEmployee, disconnectWallet);

// GET /api/employees - Get all employees
router.get('/', getAllEmployees);

// POST /api/employees - Create new employee
router.post('/', createEmployee);

// PUT /api/employees/:id - Update employee
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', deleteEmployee);

module.exports = router; 