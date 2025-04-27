const express = require('express');
const router = express.Router();
const { authenticateHR } = require('../middleware/authMiddleware');
const { 
    // Role endpoints
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    
    // Department endpoints
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require('../controllers/adminController');

// =========== ROLE MANAGEMENT ROUTES ===========

// Get all roles - No auth required
router.get('/roles', getAllRoles);

// Create a new role - HR only
router.post('/roles', authenticateHR, createRole);

// Update a role - HR only
router.put('/roles/:id', authenticateHR, updateRole);

// Delete a role - HR only
router.delete('/roles/:id', authenticateHR, deleteRole);

// =========== DEPARTMENT MANAGEMENT ROUTES ===========

// Get all departments - No auth required
router.get('/departments', getAllDepartments);

// Create a new department - HR only
router.post('/departments', authenticateHR, createDepartment);

// Update a department - HR only
router.put('/departments/:id', authenticateHR, updateDepartment);

// Delete a department - HR only
router.delete('/departments/:id', authenticateHR, deleteDepartment);

module.exports = router; 