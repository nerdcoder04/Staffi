/**
 * Employee routes with blockchain validation integration
 */

const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const { verifyEmployeeOnBlockchain, attachBlockchainStatus } = require('../middleware/blockchain-check');
const logger = require('../utils/logger');

/**
 * @route GET /api/employees
 * @desc Get all employees with optional blockchain status
 * @access Private
 */
router.get('/', attachBlockchainStatus, async (req, res) => {
  try {
    const employees = await Employee.findAll();
    
    // If blockchain verification was attached, include it in the response
    if (req.blockchainVerified !== undefined) {
      return res.status(200).json({
        success: true,
        blockchain_verification_available: true,
        data: employees
      });
    }
    
    return res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    logger.error(`Error fetching employees: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
});

/**
 * @route GET /api/employees/:id
 * @desc Get employee by ID with strict blockchain verification
 * @access Private
 */
router.get('/:id', verifyEmployeeOnBlockchain, async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findByPk(employeeId);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Employee found and blockchain verification passed (middleware would have blocked if failed)
    return res.status(200).json({
      success: true,
      blockchain_verified: true,
      data: employee
    });
  } catch (error) {
    logger.error(`Error fetching employee ${req.params.id}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error fetching employee',
      error: error.message
    });
  }
});

/**
 * @route POST /api/employees
 * @desc Create a new employee
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, position, department, salary, hire_date } = req.body;
    
    // Validate required fields
    if (!name || !email || !position || !department) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Create employee in database
    const employee = await Employee.create({
      name,
      email,
      position,
      department,
      salary,
      hire_date,
      blockchain_tx_hash: null // Will be updated when registered on blockchain
    });
    
    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
      note: 'Employee has been created in the database but not yet registered on the blockchain'
    });
  } catch (error) {
    logger.error(`Error creating employee: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
});

/**
 * @route PUT /api/employees/:id
 * @desc Update an employee with blockchain verification
 * @access Private
 */
router.put('/:id', verifyEmployeeOnBlockchain, async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { name, email, position, department, salary, hire_date } = req.body;
    
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Update employee in database
    await employee.update({
      name: name || employee.name,
      email: email || employee.email,
      position: position || employee.position,
      department: department || employee.department,
      salary: salary || employee.salary,
      hire_date: hire_date || employee.hire_date
    });
    
    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
      blockchain_verified: true,
      note: 'Employee details updated in database. Note that blockchain records will not be automatically updated.'
    });
  } catch (error) {
    logger.error(`Error updating employee ${req.params.id}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/employees/:id
 * @desc Delete an employee with blockchain verification
 * @access Private
 */
router.delete('/:id', verifyEmployeeOnBlockchain, async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Delete employee from database
    await employee.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Employee deleted from database successfully',
      blockchain_verified: true,
      note: 'Employee has been removed from the database but may still exist on the blockchain'
    });
  } catch (error) {
    logger.error(`Error deleting employee ${req.params.id}: ${error.message}`);
    return res.status(500).json({
      success: false, 
      message: 'Error deleting employee',
      error: error.message
    });
  }
});

module.exports = router; 