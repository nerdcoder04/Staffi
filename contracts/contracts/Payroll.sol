// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Employee.sol";

contract Payroll is Ownable {
    Employee public employeeContract;
    
    event SalarySent(string indexed employeeId, address wallet, uint256 amount, uint256 timestamp);
    
    constructor(address _employeeContract) Ownable(msg.sender) {
        employeeContract = Employee(_employeeContract);
    }
    
    function logPayroll(string memory employeeId, uint256 amount) external onlyOwner {
        require(employeeContract.isEmployee(employeeId), "Not a valid employee");
        
        // Get employee record to include wallet in event (optional)
        Employee.Record memory employee = employeeContract.getEmployeeById(employeeId);
        
        emit SalarySent(employeeId, employee.wallet, amount, block.timestamp);
    }
    
    function getEmployeeContract() external view returns (address) {
        return address(employeeContract);
    }
} 