# 🍃 Leave Management API

This document outlines the leave management endpoints implemented in the STAFFI backend.

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