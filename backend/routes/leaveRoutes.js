const express = require('express');
const { authenticateEmployee, authenticateHR } = require('../middleware/authMiddleware');
const leaveController = require('../controllers/leaveController');

const router = express.Router();

// Employee routes
router.post('/apply', authenticateEmployee, leaveController.applyForLeave);
router.get('/my-leaves', authenticateEmployee, leaveController.getMyLeaves);

// HR routes
router.get('/all', authenticateHR, leaveController.getAllLeaves);
router.post('/:id/approve', authenticateHR, leaveController.approveLeave);
router.post('/:id/reject', authenticateHR, leaveController.rejectLeave);

module.exports = router; 