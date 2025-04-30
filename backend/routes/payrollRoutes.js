/**
 * Payroll Routes
 */

const express = require('express');
const { authenticateHR, authenticateEmployee } = require('../middleware/authMiddleware');
const payrollController = require('../controllers/payrollController');

const router = express.Router();

// HR routes
router.post('/send', authenticateHR, payrollController.sendPayroll);
router.get('/employee/:id', authenticateHR, payrollController.getEmployeePayrolls);
router.get('/all', authenticateHR, payrollController.getAllPayrolls);

// Employee routes
router.get('/my-payments', authenticateEmployee, payrollController.getMyPayrolls);

module.exports = router; 