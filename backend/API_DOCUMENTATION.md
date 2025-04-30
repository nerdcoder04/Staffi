# STAFFI API Documentation

## 📚 Overview

This document provides a comprehensive guide to all API endpoints available in the STAFFI backend. The API is organized into several modules:

1. **Authentication** - Login and user management
2. **Employee Management** - Employee data and requests
3. **Leave Management** - Leave requests and approvals
4. **Admin Management** - Roles and departments
5. **Blockchain Integration** - Blockchain data verification
6. **Payroll Management** (Planned) - Salary records
7. **Certificate Management** (Planned) - NFT certificates
8. **AI Analytics** (Planned) - Performance predictions

## 🔐 Authentication

All protected endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

### Current Endpoints

| Method | Endpoint | Description | Auth Required | Role | Status |
|--------|----------|-------------|--------------|------|--------|
| POST | `/api/auth/hr-login` | HR login with wallet | No | - | ✅ Implemented |
| POST | `/api/auth/employee/login` | Employee login with email/password | No | - | ✅ Implemented |
| POST | `/api/auth/employee/signup` | Employee signup | No | - | ✅ Implemented |

### Login with HR Wallet

```http
POST /api/auth/hr-login
Content-Type: application/json

{
  "walletAddress": "0x1234567890123456789012345678901234567890"
}
```

**Success Response (200 OK):**
```json
{
  "message": "HR login successful",
  "user": {
    "id": "uuid-value",
    "name": "HR Manager",
    "email": "hr@example.com",
    "wallet": "0x1234567890123456789012345678901234567890"
  }
}
```

### Login with Employee Credentials

```http
POST /api/auth/employee/login
Content-Type: application/json

{
  "email": "employee@example.com",
  "password": "Password123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Employee login successful",
  "user": {
    "id": "uuid-value",
    "name": "John Employee",
    "email": "employee@example.com",
    "role": "DEVELOPER",
    "department": "ENGINEERING"
  },
  "token": "jwt-token"
}
```

## 👥 Employee Management

### Current Endpoints

| Method | Endpoint | Description | Auth Required | Role | Status |
|--------|----------|-------------|--------------|------|--------|
| POST | `/api/employee/request` | Submit employee signup request | No | - | ✅ Implemented |
| GET | `/api/employee/me` | Get employee profile | Yes | Employee | ✅ Implemented |
| PUT | `/api/employee/me` | Update employee profile | Yes | Employee | ✅ Implemented |
| PUT | `/api/employee/me/wallet` | Update employee wallet | Yes | Employee | ✅ Implemented |
| GET | `/api/employee/requests` | Get all employee requests | Yes | HR | ✅ Implemented |
| POST | `/api/employee/requests/:id/approve` | Approve employee request | Yes | HR | ✅ Implemented |
| POST | `/api/employee/requests/:id/reject` | Reject employee request | Yes | HR | ✅ Implemented |
| GET | `/api/employee/all` | Get all employees | Yes | HR | ✅ Implemented |
| GET | `/api/employee/:id` | Get employee by ID | Yes | HR | ✅ Implemented |
| PUT | `/api/employee/:id` | Update employee | Yes | HR | ✅ Implemented |
| DELETE | `/api/employee/:id` | Delete employee | Yes | HR | ✅ Implemented |
| POST | `/api/employee/:id/blockchain` | Add employee to blockchain | Yes | HR | ✅ Implemented |
| GET | `/api/employee/:id/blockchain` | Check employee on blockchain | Yes | HR | ✅ Implemented |
| PUT | `/api/employee/:id/blockchain/wallet` | Update employee blockchain wallet | Yes | HR | ✅ Implemented |

## 🚦 Employee Status Management

### Current Endpoints

| Method | Endpoint | Description | Auth Required | Role | Status |
|--------|----------|-------------|--------------|------|--------|
| PUT | `/api/employee-status/:id/status` | Update employee status | Yes | HR | ✅ Implemented |
| GET | `/api/employee-status/status/transitions/:currentStatus` | Get valid status transitions | No | - | ✅ Implemented |
| GET | `/api/employee-status/:id/status-history` | Get employee status history | Yes | HR | ✅ Implemented |

### Update Employee Status

```http
PUT /api/employee-status/123e4567-e89b-12d3-a456-426614174000/status
Content-Type: application/json
Authorization: Bearer <hr_token>

{
  "status": "SUSPENDED",
  "reason": "Code of conduct violation"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Employee status successfully updated to SUSPENDED",
  "employee": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "SUSPENDED"
  },
  "blockchain_transaction": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}
```

### Get Valid Status Transitions

```http
GET /api/employee-status/status/transitions/ACTIVE
```

**Success Response (200 OK):**
```json
{
  "current_status": "ACTIVE",
  "valid_transitions": ["INACTIVE", "ON_LEAVE", "TERMINATED", "SUSPENDED"]
}
```

### Get Employee Status History

```http
GET /api/employee-status/123e4567-e89b-12d3-a456-426614174000/status-history
Authorization: Bearer <hr_token>
```

**Success Response (200 OK):**
```json
{
  "employee_id": "123e4567-e89b-12d3-a456-426614174000",
  "employee_name": "John Doe",
  "status_history": [
    {
      "id": "uuid-value",
      "employee_id": "123e4567-e89b-12d3-a456-426614174000",
      "previous_status": "ACTIVE",
      "new_status": "SUSPENDED",
      "changed_by": "hr-uuid",
      "reason": "Code of conduct violation",
      "created_at": "2023-06-02T10:30:00Z",
      "hr_name": "HR Admin"
    }
  ]
}
```

## 🍃 Leave Management

### Current Endpoints

| Method | Endpoint | Description | Auth Required | Role | Status |
|--------|----------|-------------|--------------|------|--------|
| POST | `/api/leave/apply` | Submit a leave request | Yes | Employee | ✅ Implemented |
| GET | `/api/leave/my-leaves` | Get employee's leave history | Yes | Employee | ✅ Implemented |
| GET | `/api/leave/all` | Get all leave requests with filtering | Yes | HR | ✅ Implemented |
| POST | `/api/leave/:id/approve` | Approve a pending leave request | Yes | HR | ✅ Implemented |
| POST | `/api/leave/:id/reject` | Reject a pending leave request | Yes | HR | ✅ Implemented |
| POST | `/api/leave/:id/return` | Mark employee as returned from leave | Yes | HR | ✅ Implemented |

### Apply for Leave

```http
POST /api/leave/apply
Content-Type: application/json
Authorization: Bearer <employee_token>

{
  "reason": "Family vacation",
  "days": 5,
  "startDate": "2023-06-15"
}
```

**Success Response (201 Created):**
```json
{
  "message": "Leave application submitted successfully",
  "leave": {
    "id": "uuid-value",
    "emp_id": "employee-uuid",
    "reason": "Family vacation",
    "days": 5,
    "start_date": "2023-06-15",
    "status": "PENDING",
    "submitted_at": "2023-06-01T12:00:00Z"
  }
}
```

### Approve Leave (HR Only)

```http
POST /api/leave/:id/approve
Authorization: Bearer <hr_token>
```

**Success Response (200 OK):**
```json
{
  "message": "Leave request approved successfully and recorded on blockchain",
  "leave": {
    "id": "uuid-value",
    "emp_id": "employee-uuid",
    "reason": "Family vacation",
    "days": 5,
    "start_date": "2023-06-15",
    "status": "APPROVED",
    "approved_by": "hr-uuid",
    "approved_at": "2023-06-02T10:30:00Z",
    "blockchain_tx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  },
  "blockchain_tx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "status_update": {
    "success": true,
    "error": null,
    "transaction": "0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef"
  }
}
```

### Return From Leave (HR Only)

```http
POST /api/leave/:id/return
Content-Type: application/json
Authorization: Bearer <hr_token>

{
  "comments": "Employee returned as scheduled"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Employee marked as returned from leave successfully",
  "leave": {
    "id": "uuid-value",
    "emp_id": "employee-uuid",
    "reason": "Family vacation",
    "days": 5,
    "start_date": "2023-06-15",
    "status": "COMPLETED",
    "return_date": "2023-07-20T09:00:00Z",
    "return_comments": "Employee returned as scheduled"
  },
  "status_update": {
    "success": true,
    "error": null,
    "transaction": "0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef"
  }
}
```

## 🏢 Admin Management

### Current Endpoints

| Method | Endpoint | Description | Auth Required | Role | Status |
|--------|----------|-------------|--------------|------|--------|
| GET | `/api/admin/roles` | Get all roles | No | - | ✅ Implemented |
| POST | `/api/admin/roles` | Create a new role | Yes | HR | ✅ Implemented |
| PUT | `/api/admin/roles/:id` | Update an existing role | Yes | HR | ✅ Implemented |
| DELETE | `/api/admin/roles/:id` | Delete a role | Yes | HR | ✅ Implemented |
| GET | `/api/admin/departments` | Get all departments | No | - | ✅ Implemented |
| POST | `/api/admin/departments` | Create a new department | Yes | HR | ✅ Implemented |
| PUT | `/api/admin/departments/:id` | Update an existing department | Yes | HR | ✅ Implemented |
| DELETE | `/api/admin/departments/:id` | Delete a department | Yes | HR | ✅ Implemented |

### Get All Roles

```http
GET /api/admin/roles
```

**Success Response (200 OK):**
```json
{
  "roles": [
    { "id": 1, "role_name": "ADMIN", "description": "Administrator with full access" },
    { "id": 2, "role_name": "MANAGER", "description": "Team or department manager" },
    { "id": 3, "role_name": "DEVELOPER", "description": "Software developer or engineer" }
  ]
}
```

### Get All Departments

```http
GET /api/admin/departments
```

**Success Response (200 OK):**
```json
{
  "departments": [
    { "id": 1, "dept_name": "ENGINEERING", "description": "Software development and engineering" },
    { "id": 2, "dept_name": "DESIGN", "description": "Product and graphic design" },
    { "id": 3, "dept_name": "OPERATIONS", "description": "Business operations" }
  ]
}
```

## 💸 Payroll Management (Planned)

### Future Endpoints

| Method | Endpoint | Description | Auth Required | Role | Status |
|--------|----------|-------------|--------------|------|--------|
| POST | `/api/payroll/send` | Record salary payment | Yes | HR | 🚧 Planned |
| GET | `/api/payroll/employee/:id` | Get employee payment history | Yes | HR | 🚧 Planned |
| GET | `/api/payroll/my-payments` | Get my payment history | Yes | Employee | 🚧 Planned |

**Implementation Status**: The Payroll Management module is currently planned but not yet implemented. See the [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) document for the timeline and development roadmap.

## 🏅 Certificate Management (Planned)

### Future Endpoints

| Method | Endpoint | Description | Auth Required | Role | Status |
|--------|----------|-------------|--------------|------|--------|
| POST | `/api/certificate/mint` | Mint a new certificate NFT | Yes | HR | 🚧 Planned |
| GET | `/api/certificate/employee/:id` | Get employee certificates | Yes | HR | 🚧 Planned |
| GET | `/api/certificate/my-certificates` | Get my certificates | Yes | Employee | 🚧 Planned |

**Implementation Status**: The Certificate Management module is currently planned but not yet implemented. See the [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) document for the timeline and development roadmap.

## 🧠 AI Prediction Engine (Planned)

### Future Endpoints

| Method | Endpoint | Description | Auth Required | Role | Status |
|--------|----------|-------------|--------------|------|--------|
| POST | `/api/ai/predict` | Generate engagement prediction | Yes | HR | 🚧 Planned |
| GET | `/api/ai/history` | Get prediction history | Yes | HR | 🚧 Planned |

**Implementation Status**: The AI Prediction Engine module is currently planned but not yet implemented. See the [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) document for the timeline and development roadmap.

## 🛡️ Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error title",
  "message": "Detailed error message",
  "details": "Additional information (optional)"
}
```

Common HTTP status codes:
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `409 Conflict` - Request conflicts with existing data
- `500 Internal Server Error` - Server-side error

## 📊 Database Schema

For detailed information about the database schema, refer to the `DATABASE.md` and `schema.sql` files.

## 🔗 Blockchain Integration

The API integrates with the following smart contracts:
- `Employee.sol` - Employee records and leave history (✅ Implemented)
- `Payroll.sol` - Salary payment records (🚧 Planned)
- `NFTCert.sol` - Certificate NFTs (🚧 Planned)

For detailed information about the smart contracts, refer to the `CONTRACT_PLAN.md` file.

## 📋 Complete Endpoint List

Below is a comprehensive list of all endpoints that currently exist in the backend:

### Authentication Routes (`/api/auth`)
- `POST /api/auth/hr-login` - HR login with wallet
- `POST /api/auth/employee/login` - Employee login
- `POST /api/auth/employee/signup` - Employee signup
- `POST /api/auth/verify-token` - Verify JWT token (for debugging)

### HR Routes (`/api/hr`)
- `POST /api/hr/add` - Create new HR user
- `GET /api/hr/all` - Get all HR users
- `GET /api/hr/details` - Get HR details
- `GET /api/hr/employee-requests` - Get all employee signup requests
- `POST /api/hr/employee-requests/:id/approve` - Approve employee signup request
- `POST /api/hr/employee-requests/:id/reject` - Reject employee signup request

### Employee Routes (`/api/employee`)
- `POST /api/employee/request` - Submit employee signup request
- `GET /api/employee/me` - Get own employee profile
- `PUT /api/employee/me` - Update own employee profile
- `PUT /api/employee/me/wallet` - Update own wallet
- `GET /api/employee/requests` - Get all employee requests (HR only)
- `POST /api/employee/requests/:id/approve` - Approve employee request (HR only)
- `POST /api/employee/requests/:id/reject` - Reject employee request (HR only)
- `GET /api/employee/all` - Get all employees (HR only)
- `GET /api/employee/:id` - Get employee by ID (HR only)
- `PUT /api/employee/:id` - Update employee (HR only)
- `DELETE /api/employee/:id` - Delete employee (HR only)
- `POST /api/employee/:id/blockchain` - Add employee to blockchain (HR only)
- `GET /api/employee/:id/blockchain` - Check employee on blockchain (HR only)
- `PUT /api/employee/:id/blockchain/wallet` - Update employee blockchain wallet (HR only)

### Employee Status Routes (`/api/employee-status`)
- `PUT /api/employee-status/:id/status` - Update employee status (HR only)
- `GET /api/employee-status/status/transitions/:currentStatus` - Get valid status transitions
- `GET /api/employee-status/:id/status-history` - Get employee status history (HR only)

### Leave Routes (`/api/leave`)
- `POST /api/leave/apply` - Submit a leave request (Employee)
- `GET /api/leave/my-leaves` - Get employee's leave history (Employee)
- `GET /api/leave/all` - Get all leave requests (HR only)
- `POST /api/leave/:id/approve` - Approve a leave request (HR only)
- `POST /api/leave/:id/reject` - Reject a leave request (HR only)
- `POST /api/leave/:id/return` - Mark employee as returned from leave (HR only)

### Admin Routes (`/api/admin`)
- `GET /api/admin/roles` - Get all roles
- `POST /api/admin/roles` - Create a new role (HR only)
- `PUT /api/admin/roles/:id` - Update a role (HR only)
- `DELETE /api/admin/roles/:id` - Delete a role (HR only)
- `GET /api/admin/departments` - Get all departments
- `POST /api/admin/departments` - Create a new department (HR only)
- `PUT /api/admin/departments/:id` - Update a department (HR only)
- `DELETE /api/admin/departments/:id` - Delete a department (HR only)

### Alternative Employee Routes (Legacy/Duplicate)
- `GET /api/employees` - Get all employees with blockchain status
- `GET /api/employees/:id` - Get employee by ID with blockchain verification
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/:id` - Update an employee with blockchain verification
- `DELETE /api/employees/:id` - Delete an employee with blockchain verification

### Blockchain Integration Routes
- `GET /api/blockchain/employees/:id/verify` - Verify if employee exists on blockchain
- `POST /api/blockchain/employees/:id/register` - Register employee on blockchain
- `GET /api/blockchain/employees/status` - Get blockchain synchronization status

### Health Check
- `GET /api/health` - API health check
- `GET /api/protected/hr-route` - Test HR auth (returns 200 if HR auth works)
- `GET /api/protected/employee-route` - Test Employee auth (returns 200 if Employee auth works)

### Routes Pending Implementation
- `POST /api/payroll/send` - Record salary payment (🚧 Planned)
- `GET /api/payroll/employee/:id` - Get employee payment history (🚧 Planned)
- `GET /api/payroll/my-payments` - Get my payment history (🚧 Planned)
- `POST /api/certificate/mint` - Mint a new certificate NFT (🚧 Planned)
- `GET /api/certificate/employee/:id` - Get employee certificates (🚧 Planned)
- `GET /api/certificate/my-certificates` - Get my certificates (🚧 Planned)
- `POST /api/ai/predict` - Generate engagement prediction (🚧 Planned)
- `GET /api/ai/history` - Get prediction history (🚧 Planned) 