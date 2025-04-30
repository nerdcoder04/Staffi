/**
 * Employee routes
 */

const express = require('express');
const { authenticateEmployee, authenticateHR } = require('../middleware/authMiddleware');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

// Public routes
router.post('/request', employeeController.requestEmployeeSignup);

// Employee routes
router.get('/me', authenticateEmployee, employeeController.getEmployeeProfile);
router.put('/me', authenticateEmployee, employeeController.updateEmployeeProfile);
router.put('/me/wallet', authenticateEmployee, employeeController.updateEmployeeWallet);

// HR-only routes
router.get('/requests', authenticateHR, employeeController.getAllEmployeeRequests);
router.post('/requests/:id/approve', authenticateHR, employeeController.approveEmployeeRequest);
router.post('/requests/:id/reject', authenticateHR, employeeController.rejectEmployeeRequest);

router.get('/all', authenticateHR, employeeController.getAllEmployees);
router.get('/:id', authenticateHR, employeeController.getEmployeeById);
router.put('/:id', authenticateHR, employeeController.updateEmployee);
router.delete('/:id', authenticateHR, employeeController.deleteEmployee);

// Blockchain-related routes (HR only)
router.post('/:id/blockchain', authenticateHR, employeeController.addEmployeeToBlockchain);
router.get('/:id/blockchain', authenticateHR, employeeController.checkEmployeeBlockchainStatus);
router.put('/:id/blockchain/wallet', authenticateHR, employeeController.updateEmployeeBlockchainWallet);

module.exports = router; 