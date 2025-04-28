/**
 * App.js update for employee status routes
 * 
 * Add the following to your app.js file to register the new employee status routes:
 */

// In the imports section, add:
const employeeStatusRoutes = require('./routes/employeeStatusRoutes');

// In the routes registration section, add:
app.use('/api/employee-status', employeeStatusRoutes);

/**
 * This provides the following new API endpoints:
 * 
 * 1. PUT /api/employee-status/:id/status
 *    - Update an employee's status (HR only)
 *    - body: { status: 'ACTIVE'|'INACTIVE'|'ON_LEAVE'|'TERMINATED'|'SUSPENDED', reason: 'Optional reason' }
 * 
 * 2. GET /api/employee-status/status/transitions/:currentStatus
 *    - Get valid status transitions for a given current status
 *    - Example: /api/employee-status/status/transitions/ACTIVE
 * 
 * 3. POST /api/employee-status/leave-request
 *    - Request leave of absence (Employee only)
 *    - body: { startDate: '2025-05-01', endDate: '2025-05-05', reason: 'Vacation' }
 * 
 * 4. GET /api/employee-status/:id/status-history
 *    - Get history of status changes for an employee (HR only)
 *    - Example: /api/employee-status/123/status-history
 */ 