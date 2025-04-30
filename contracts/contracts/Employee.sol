// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Employee is Ownable {
    struct Record {
        string employeeId;  // Database ID as primary identifier
        string name;
        address wallet;     // Can be address(0) if not connected
        string role;
        string doj;
        string department;
    }

    // Map employee IDs to records
    mapping(string => Record) public employeesByID;
    
    // Secondary index: wallet -> employeeId (only for employees with wallets)
    mapping(address => string) public walletToEmployeeId;
    
    // Track existing employee IDs
    mapping(string => bool) public isEmployee;

    // Status tracking
    struct StatusRecord {
        string status;
        string reason;
        uint256 timestamp;
    }
    
    // Store status records per employee ID
    mapping(string => StatusRecord[]) public statusRecords;

    // Events
    event EmployeeAdded(string indexed employeeId, string name, address wallet);
    event EmployeeWalletUpdated(string indexed employeeId, address newWallet);
    event EmployeeStatusUpdated(string indexed employeeId, string status, string reason);
    
    // Leave tracking
    struct LeaveRecord {
        uint256 leaveDays;  // Changed from 'days' to 'leaveDays' to avoid reserved word
        string reason;
        uint256 timestamp;
    }
    
    // Store leave records per employee ID
    mapping(string => LeaveRecord[]) public leaveRecords;
    event LeaveApproved(string indexed employeeId, uint256 leaveDays, string reason);

    constructor() Ownable(msg.sender) {}

    function addEmployee(
        string memory employeeId,
        string memory name,
        address wallet,
        string memory role,
        string memory doj,
        string memory department
    ) external onlyOwner {
        require(!isEmployee[employeeId], "Employee ID already exists");
        
        // If wallet is provided and non-zero, ensure it's not already assigned
        if (wallet != address(0)) {
            require(bytes(walletToEmployeeId[wallet]).length == 0, "Wallet already assigned to an employee");
            walletToEmployeeId[wallet] = employeeId;
        }
        
        employeesByID[employeeId] = Record({
            employeeId: employeeId,
            name: name,
            wallet: wallet,
            role: role,
            doj: doj,
            department: department
        });
        
        isEmployee[employeeId] = true;
        emit EmployeeAdded(employeeId, name, wallet);
    }

    function updateEmployeeWallet(string memory employeeId, address newWallet) external onlyOwner {
        require(isEmployee[employeeId], "Employee does not exist");
        
        // If employee already had a wallet, remove old mapping
        address oldWallet = employeesByID[employeeId].wallet;
        if (oldWallet != address(0)) {
            delete walletToEmployeeId[oldWallet];
        }
        
        // If new wallet is provided and non-zero, ensure it's not already assigned
        if (newWallet != address(0)) {
            require(bytes(walletToEmployeeId[newWallet]).length == 0, "Wallet already assigned to an employee");
            walletToEmployeeId[newWallet] = employeeId;
        }
        
        // Update the wallet
        employeesByID[employeeId].wallet = newWallet;
        emit EmployeeWalletUpdated(employeeId, newWallet);
    }

    // Update employee status on-chain
    function updateEmployeeStatus(string memory employeeId, string memory status, string memory reason) external onlyOwner {
        require(isEmployee[employeeId], "Employee does not exist");
        
        statusRecords[employeeId].push(StatusRecord({
            status: status,
            reason: reason,
            timestamp: block.timestamp
        }));
        
        emit EmployeeStatusUpdated(employeeId, status, reason);
    }
    
    // Get all status records for an employee
    function getStatusRecords(string memory employeeId) 
        external 
        view 
        returns (StatusRecord[] memory) 
    {
        require(isEmployee[employeeId], "Employee does not exist");
        return statusRecords[employeeId];
    }

    function getEmployeeById(string memory employeeId) 
        external 
        view 
        returns (Record memory) 
    {
        require(isEmployee[employeeId], "Employee does not exist");
        return employeesByID[employeeId];
    }
    
    function getEmployeeByWallet(address wallet) 
        external 
        view 
        returns (Record memory) 
    {
        string memory employeeId = walletToEmployeeId[wallet];
        require(bytes(employeeId).length > 0, "No employee with this wallet");
        return employeesByID[employeeId];
    }

    // Record leave approval on-chain
    function leaveApproved(string memory employeeId, uint256 leaveDays, string memory reason) external onlyOwner {
        require(isEmployee[employeeId], "Employee does not exist");
        
        leaveRecords[employeeId].push(LeaveRecord({
            leaveDays: leaveDays,
            reason: reason,
            timestamp: block.timestamp
        }));
        
        emit LeaveApproved(employeeId, leaveDays, reason);
    }
    
    // Get all leave records for an employee
    function getLeaveRecords(string memory employeeId) 
        external 
        view 
        returns (LeaveRecord[] memory) 
    {
        require(isEmployee[employeeId], "Employee does not exist");
        return leaveRecords[employeeId];
    }
} 