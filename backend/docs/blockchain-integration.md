# Blockchain Integration in STAFFI

This document outlines the blockchain integration in the STAFFI application.

## Overview

The STAFFI application integrates with the Ethereum blockchain using smart contracts for:
- Employee record management
- Leave approval tracking
- Certificate issuance (NFTs)

## Smart Contracts

The main contracts used are:
- `Employee.sol`: Manages employee records on the blockchain
- `Payroll.sol`: Handles salary and payment information
- `NFTCert.sol`: Issues and manages employee certificates as NFTs

## Integration Points

### Employee Management
- When HR approves a new employee, the employee is added to the blockchain
- Employee data stored includes: ID, name, role, and department
- The blockchain transaction hash is stored in the database

### Employee Blockchain Status Check
- API endpoint: `GET /api/hr/employee/:id/blockchain-status`
- Checks if an employee exists on the blockchain

### Adding Employee to Blockchain
- API endpoint: `POST /api/hr/employee/:id/add-to-blockchain`
- Manually adds an existing employee to the blockchain

### Leave Management
- When leave is approved, it's recorded on the blockchain
- Leave records include employee ID, leave type, and duration
- The blockchain transaction hash is stored in the database

## Data Synchronization

A script is available to synchronize all employees with the blockchain:
```
npm run blockchain:sync-employees
```

This script:
1. Fetches all employees from the database
2. Checks if each employee exists on the blockchain
3. Adds employees that don't exist on the blockchain
4. Logs detailed results of the synchronization process

## Error Handling

The integration includes robust error handling:
- Checks for blockchain service availability before operations
- Rolls back database changes if blockchain operations fail
- Logs detailed error information for troubleshooting

## Database Schema

The following tables include blockchain-related columns:
- `employees`: `blockchain_tx` column stores the transaction hash
- `employee_requests`: `blockchain_tx` column stores the transaction hash
- `leave_requests`: `blockchain_tx` column stores the transaction hash

## Testing

Blockchain integration can be bypassed in test environments by setting:
```
process.env.NODE_ENV = 'test'
```

This allows tests to run without actual blockchain interactions. 