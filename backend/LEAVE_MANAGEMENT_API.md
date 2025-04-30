# 🍃 Leave Management API

## 📋 Endpoints Overview

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| POST | `/api/leave/apply` | Submit a leave request | Yes | Employee |
| GET | `/api/leave/my-leaves` | Get employee's leave history | Yes | Employee |
| GET | `/api/leave/all` | Get all leave requests with filtering | Yes | HR |
| POST | `/api/leave/:id/approve` | Approve a pending leave request | Yes | HR |
| POST | `/api/leave/:id/reject` | Reject a pending leave request | Yes | HR |

## 🔐 Authentication

All endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

## 🛠️ Detailed API Reference

### 1. Apply for Leave

Allows employees to submit a new leave request.

```http
POST /api/leave/apply
Content-Type: application/json
Authorization: Bearer <employee_token>
```

**Request Body:**
```json
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

**Validation Errors (400 Bad Request):**
```json
{
  "error": "Reason, days, and start date are required"
}
```
OR
```json
{
  "error": "Number of days must be greater than 0"
}
```

### 2. View My Leaves

Allows employees to view their leave history.

```http
GET /api/leave/my-leaves
Authorization: Bearer <employee_token>
```

**Success Response (200 OK):**
```json
{
  "leaves": [
    {
      "id": "uuid-value",
      "emp_id": "employee-uuid",
      "reason": "Family vacation",
      "days": 5,
      "start_date": "2023-06-15",
      "status": "APPROVED",
      "submitted_at": "2023-06-01T12:00:00Z",
      "approved_by": "hr-uuid",
      "approved_at": "2023-06-02T10:30:00Z",
      "blockchain_tx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    },
    {
      "id": "uuid-value-2",
      "emp_id": "employee-uuid",
      "reason": "Medical appointment",
      "days": 1,
      "start_date": "2023-05-10",
      "status": "REJECTED",
      "submitted_at": "2023-05-08T09:15:00Z",
      "rejected_by": "hr-uuid",
      "rejected_at": "2023-05-08T14:20:00Z",
      "rejection_reason": "Short notice"
    }
  ]
}
```

### 3. View All Leaves (HR Only)

Allows HR to view and filter all leave requests.

```http
GET /api/leave/all
Authorization: Bearer <hr_token>
```

**Optional Query Parameters:**
- `status`: Filter by status (PENDING, APPROVED, REJECTED)
- `department`: Filter by department ID

**Success Response (200 OK):**
```json
{
  "leaves": [
    {
      "id": "uuid-value",
      "emp_id": "employee-uuid",
      "reason": "Family vacation",
      "days": 5,
      "start_date": "2023-06-15",
      "status": "APPROVED",
      "submitted_at": "2023-06-01T12:00:00Z",
      "approved_by": "hr-uuid",
      "approved_at": "2023-06-02T10:30:00Z",
      "blockchain_tx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "employees": {
        "name": "John Doe",
        "email": "john@example.com",
        "role_id": 2,
        "department_id": 3
      }
    }
  ]
}
```

### 4. Approve Leave (HR Only)

Allows HR to approve a pending leave request.

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
    "submitted_at": "2023-06-01T12:00:00Z",
    "approved_by": "hr-uuid",
    "approved_at": "2023-06-02T10:30:00Z",
    "blockchain_tx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  },
  "blockchain_tx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}
```

**Error Responses:**
- **404 Not Found:** `{ "error": "Leave request not found" }`
- **400 Bad Request:** `{ "error": "Leave request is already processed" }`
- **503 Service Unavailable:** 
  ```json
  {
    "error": "Blockchain service unavailable. Smart contract not initialized.",
    "details": "Contact administrator to ensure proper blockchain configuration."
  }
  ```
- **503 Service Unavailable:**
  ```json
  {
    "error": "Blockchain network unavailable. Please try again later.",
    "details": "Connection to Ethereum network failed."
  }
  ```
- **503 Service Unavailable:**
  ```json
  {
    "error": "Blockchain transaction failed. Leave not approved.",
    "details": "Error message from blockchain"
  }
  ```

### 5. Reject Leave (HR Only)

Allows HR to reject a pending leave request with a reason.

```http
POST /api/leave/:id/reject
Content-Type: application/json
Authorization: Bearer <hr_token>

{
  "rejectionReason": "Insufficient team coverage during that period"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Leave request rejected successfully",
  "leave": {
    "id": "uuid-value",
    "emp_id": "employee-uuid",
    "reason": "Family vacation",
    "days": 5,
    "start_date": "2023-06-15",
    "status": "REJECTED",
    "submitted_at": "2023-06-01T12:00:00Z",
    "rejected_by": "hr-uuid",
    "rejected_at": "2023-06-02T10:30:00Z",
    "rejection_reason": "Insufficient team coverage during that period"
  }
}
```

**Error Responses:**
- **400 Bad Request:** `{ "error": "Rejection reason is required" }`
- **404 Not Found:** `{ "error": "Leave request not found" }`
- **400 Bad Request:** `{ "error": "Leave request is already processed" }`

## 🔄 Database Schema

The leave management API uses the following table structure:

```sql
CREATE TABLE IF NOT EXISTS leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emp_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    days INTEGER NOT NULL CHECK (days > 0),
    start_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES hr_users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES hr_users(id),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    blockchain_tx TEXT, -- Stores the blockchain transaction hash
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

Unit tests for the leave management API are available in:
```
backend/__tests__/leave.test.js
```

Run the tests with:
```bash
npm test -- -t "Leave Management API"
```

## 🔗 Blockchain Integration

Leave approvals are recorded on the Ethereum blockchain using the Employee smart contract. The process:

1. When an HR approves a leave request, the system first attempts to record it on the blockchain
2. Only if the blockchain transaction succeeds will the database be updated with approval status
3. The blockchain transaction hash is stored in the `blockchain_tx` field
4. If the blockchain is unavailable or the transaction fails, the leave will not be approved
5. Clear error messages are provided to guide users when blockchain operations fail 

## Overview

This document provides comprehensive documentation for the Leave Management API endpoints in the STAFFI platform. These endpoints handle employee leave requests, approvals, rejections, and returns, with automatic integration with the employee status system and blockchain record-keeping.

## Base URL

All endpoints are relative to the base URL:

```
https://api.staffi.com/api/leave
```

## Authentication

All HR endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <hr_token>
```

Employee endpoints require employee authentication:

```http
Authorization: Bearer <employee_token>
```

## Leave Status Values

The system supports the following leave request status values:

| Status | Description |
|--------|-------------|
| `PENDING` | Leave request is awaiting HR approval |
| `APPROVED` | Leave request has been approved |
| `REJECTED` | Leave request has been rejected |
| `COMPLETED` | Employee has returned from leave |

## Endpoints

### 1. Apply for Leave (Employee)

Submit a leave request for approval.

```http
POST /apply
Content-Type: application/json
Authorization: Bearer <employee_token>

{
  "reason": "Family vacation",
  "days": 5,
  "startDate": "2023-07-15"
}
```

**Request Body:**
- `reason` (required) - Reason for leave request
- `days` (required) - Number of days requested
- `startDate` (required) - Start date of leave (YYYY-MM-DD)

**Success Response (201 Created):**
```json
{
  "message": "Leave application submitted successfully",
  "leave": {
    "id": "uuid-value",
    "emp_id": "employee-uuid",
    "reason": "Family vacation",
    "days": 5,
    "start_date": "2023-07-15",
    "status": "PENDING",
    "submitted_at": "2023-06-01T12:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input (negative days, missing fields)
- `500 Internal Server Error` - Server-side error

### 2. Get My Leave Requests (Employee)

Retrieve leave history for the authenticated employee.

```http
GET /my-leaves
Authorization: Bearer <employee_token>
```

**Success Response (200 OK):**
```json
{
  "leaves": [
    {
      "id": "uuid-value",
      "emp_id": "employee-uuid",
      "reason": "Family vacation",
      "days": 5,
      "start_date": "2023-07-15",
      "status": "PENDING",
      "submitted_at": "2023-06-01T12:00:00Z"
    }
  ]
}
```

### 3. Get All Leave Requests (HR)

Retrieve all leave requests with optional filtering.

```http
GET /all
Authorization: Bearer <hr_token>
```

**Query Parameters:**
- `status` (optional) - Filter by status (PENDING, APPROVED, REJECTED, COMPLETED)
- `department` (optional) - Filter by department ID

**Success Response (200 OK):**
```json
{
  "leaves": [
    {
      "id": "uuid-value",
      "emp_id": "employee-uuid",
      "reason": "Family vacation",
      "days": 5,
      "start_date": "2023-07-15",
      "status": "PENDING",
      "submitted_at": "2023-06-01T12:00:00Z",
      "employees": {
        "name": "John Doe",
        "email": "john@example.com",
        "role_id": 2,
        "department_id": 3
      }
    }
  ]
}
```

### 4. Approve Leave Request (HR)

Approve a leave request and automatically update employee status to ON_LEAVE.

```http
POST /:id/approve
Authorization: Bearer <hr_token>
```

**Path Parameters:**
- `id` - Leave request UUID

**Success Response (200 OK):**
```json
{
  "message": "Leave request approved successfully and recorded on blockchain",
  "leave": {
    "id": "uuid-value",
    "emp_id": "employee-uuid",
    "reason": "Family vacation",
    "days": 5,
    "start_date": "2023-07-15",
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

**Error Responses:**
- `400 Bad Request` - Leave already processed or employee not on blockchain
- `404 Not Found` - Leave request not found
- `503 Service Unavailable` - Blockchain unavailable

**Blockchain Integration:**
When a leave request is approved, two blockchain transactions occur:
1. The leave approval is recorded using `recordLeaveApproval`
2. The employee status is updated to ON_LEAVE using `updateEmployeeStatus`

### 5. Reject Leave Request (HR)

Reject a leave request.

```http
POST /:id/reject
Content-Type: application/json
Authorization: Bearer <hr_token>

{
  "rejectionReason": "Staffing shortage during requested period"
}
```

**Path Parameters:**
- `id` - Leave request UUID

**Request Body:**
- `rejectionReason` (required) - Reason for rejecting the leave request

**Success Response (200 OK):**
```json
{
  "message": "Leave request rejected successfully",
  "leave": {
    "id": "uuid-value",
    "emp_id": "employee-uuid",
    "reason": "Family vacation",
    "days": 5,
    "start_date": "2023-07-15",
    "status": "REJECTED",
    "rejected_by": "hr-uuid",
    "rejected_at": "2023-06-02T10:30:00Z",
    "rejection_reason": "Staffing shortage during requested period"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Leave already processed or missing rejection reason
- `404 Not Found` - Leave request not found

### 6. Return From Leave (HR)

Mark an employee as returned from leave and automatically update their status to ACTIVE.

```http
POST /:id/return
Content-Type: application/json
Authorization: Bearer <hr_token>

{
  "comments": "Employee returned as scheduled"
}
```

**Path Parameters:**
- `id` - Leave request UUID

**Request Body:**
- `comments` (optional) - Comments about the return from leave

**Success Response (200 OK):**
```json
{
  "message": "Employee marked as returned from leave successfully",
  "leave": {
    "id": "uuid-value",
    "emp_id": "employee-uuid",
    "reason": "Family vacation",
    "days": 5,
    "start_date": "2023-07-15",
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

**Error Responses:**
- `400 Bad Request` - Leave not in APPROVED state or employee not in ON_LEAVE status
- `404 Not Found` - Leave request not found

**Blockchain Integration:**
When an employee returns from leave, the following blockchain transaction occurs:
- The employee status is updated to ACTIVE using `updateEmployeeStatus`

## Employee Status Integration

The Leave Management system is tightly integrated with the Employee Status system:

1. When a leave request is approved, the employee's status is automatically changed to `ON_LEAVE`
2. When an employee returns from leave, their status is automatically changed back to `ACTIVE`
3. All status changes are recorded in the `employee_status_history` table
4. All status changes are also recorded on the blockchain

## Blockchain Integration

All leave-related activities are recorded on the Ethereum blockchain for transparency and immutability:

1. **Leave Approvals**: When HR approves a leave request, it's recorded on the blockchain using the `recordLeaveApproval` function
2. **Status Changes**: When an employee's status changes to ON_LEAVE or back to ACTIVE, it's recorded using the `updateEmployeeStatus` function

This provides an immutable audit trail of all leave approvals and employee status changes.

## Database Schema

The leave management system uses the following tables:

### Table: `leaves`

| Field        | Type     |
|--------------|----------|
| id           | UUID (PK)|
| emp_id       | UUID (FK)|
| reason       | Text     |
| days         | Int      |
| start_date   | Date     |
| end_date     | Date     |
| status       | Text     |
| submitted_at | Timestamp|
| approved_by  | UUID (FK)|
| approved_at  | Timestamp|
| rejected_by  | UUID (FK)|
| rejected_at  | Timestamp|
| rejection_reason | Text |
| return_date  | Timestamp|
| return_comments | Text  |
| blockchain_tx| Text     |

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error title",
  "message": "Detailed error message",
  "details": "Additional information (optional)"
}
``` 