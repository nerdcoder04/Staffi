# Employee Status Management API

## Overview

This document provides comprehensive documentation for the Employee Status Management API endpoints in the STAFFI platform. These endpoints handle all employee status changes, status history tracking, and integration with the blockchain for immutable record-keeping.

## Base URL

All endpoints are relative to the base URL:

```
https://api.staffi.com/api
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

## Status Values

The system supports the following employee status values:

| Status | Description |
|--------|-------------|
| `ACTIVE` | Employee is actively working |
| `INACTIVE` | Employee is temporarily inactive |
| `ON_LEAVE` | Employee is on approved leave |
| `TERMINATED` | Employee's contract has been terminated |
| `SUSPENDED` | Employee has been suspended |

## Endpoints

### 1. Update Employee Status

Update an employee's status and automatically record the change on the blockchain.

```http
PUT /employee-status/:id/status
Content-Type: application/json
Authorization: Bearer <hr_token>

{
  "status": "SUSPENDED",
  "reason": "Code of conduct violation"
}
```

**Path Parameters:**
- `id` - Employee UUID

**Request Body:**
- `status` (required) - New status value (one of: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED, SUSPENDED)
- `reason` (required) - Reason for the status change

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

**Error Responses:**
- `400 Bad Request` - Invalid status value or missing reason
- `404 Not Found` - Employee not found
- `500 Internal Server Error` - Server-side error or blockchain unavailable

### 2. Get Valid Status Transitions

Retrieve the valid status transitions from a given current status.

```http
GET /employee-status/status/transitions/:currentStatus
```

**Path Parameters:**
- `currentStatus` - Current employee status (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED, SUSPENDED)

**Success Response (200 OK):**
```json
{
  "current_status": "ACTIVE",
  "valid_transitions": ["INACTIVE", "ON_LEAVE", "TERMINATED", "SUSPENDED"]
}
```

**Error Responses:**
- `400 Bad Request` - Invalid current status

### 3. Get Employee Status History

Retrieve the complete status change history for an employee.

```http
GET /employee-status/:id/status-history
Authorization: Bearer <hr_token>
```

**Path Parameters:**
- `id` - Employee UUID

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
      "hr_name": "HR Admin",
      "blockchain_tx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    },
    {
      "id": "uuid-value-2",
      "employee_id": "123e4567-e89b-12d3-a456-426614174000",
      "previous_status": "ON_LEAVE",
      "new_status": "ACTIVE",
      "changed_by": "hr-uuid",
      "reason": "Returned from leave",
      "created_at": "2023-05-15T14:22:00Z",
      "hr_name": "HR Admin",
      "blockchain_tx": "0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Employee not found
- `500 Internal Server Error` - Server-side error

### 4. Request Leave of Absence

Employee can request a leave of absence, which will automatically update their status to ON_LEAVE upon approval.

```http
POST /employee-status/leave-request
Content-Type: application/json
Authorization: Bearer <employee_token>

{
  "reason": "Family emergency",
  "days": 14,
  "startDate": "2023-07-15"
}
```

**Request Body:**
- `reason` (required) - Reason for the leave request
- `days` (required) - Number of days requested
- `startDate` (required) - Start date of the leave (YYYY-MM-DD)

**Success Response (201 Created):**
```json
{
  "message": "Leave request submitted successfully",
  "request": {
    "id": "uuid-value",
    "employee_id": "123e4567-e89b-12d3-a456-426614174000",
    "reason": "Family emergency",
    "days": 14,
    "start_date": "2023-07-15",
    "status": "PENDING",
    "submitted_at": "2023-07-01T09:45:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input (negative days, past start date)
- `500 Internal Server Error` - Server-side error

## Blockchain Integration

All status changes are automatically recorded on the Ethereum blockchain using the Employee smart contract's `updateEmployeeStatus` function. This ensures immutable record-keeping and transparency for all status changes.

When a status change is made, the following happens:
1. The status is updated in the database
2. The status change is recorded in the `employee_status_history` table
3. The change is recorded on the blockchain with the following parameters:
   - Employee ID
   - New status
   - Reason for change
   - Timestamp

## Database Schema

The employee status feature uses the following tables:

### Table: `employee_status_history`

| Field        | Type     |
|--------------|----------|
| id           | UUID (PK)|
| employee_id  | UUID (FK)|
| previous_status | Text  |
| new_status   | Text     |
| changed_by   | UUID (FK)|
| reason       | Text     |
| created_at   | Timestamp|
| blockchain_tx| Text     |

### View: `employee_status_history_view`

This view joins the status history with HR and employee information for easier querying.

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error title",
  "message": "Detailed error message",
  "details": "Additional information (optional)"
}
``` 