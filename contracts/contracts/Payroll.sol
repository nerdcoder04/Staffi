// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Employee.sol";

contract Payroll is Ownable {
    Employee public employeeContract;
    
    event SalarySent(address indexed emp, uint256 amount, uint256 timestamp);
    
    constructor(address _employeeContract) Ownable(msg.sender) {
        employeeContract = Employee(_employeeContract);
    }
    
    function logPayroll(address emp, uint256 amount) external onlyOwner {
        require(employeeContract.isEmployee(emp), "Not a valid employee");
        emit SalarySent(emp, amount, block.timestamp);
    }
    
    function getEmployeeContract() external view returns (address) {
        return address(employeeContract);
    }
} 