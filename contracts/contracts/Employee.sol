// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Employee is Ownable {
    struct Record {
        string name;
        address wallet;
        string role;
        string doj;
        string department;
    }

    mapping(address => Record) public employees;
    mapping(address => bool) public isEmployee;

    event EmployeeAdded(address indexed wallet, string name);

    constructor() Ownable(msg.sender) {}

    function addEmployee(
        address wallet,
        string memory name,
        string memory role,
        string memory doj,
        string memory department
    ) external onlyOwner {
        require(!isEmployee[wallet], "Employee already exists");
        
        employees[wallet] = Record({
            name: name,
            wallet: wallet,
            role: role,
            doj: doj,
            department: department
        });
        
        isEmployee[wallet] = true;
        emit EmployeeAdded(wallet, name);
    }

    function getEmployee(address wallet) 
        external 
        view 
        returns (Record memory) 
    {
        require(isEmployee[wallet], "Employee does not exist");
        return employees[wallet];
    }
} 