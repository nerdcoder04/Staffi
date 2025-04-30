const hre = require("hardhat");
require('dotenv').config();

async function main() {
  const employeeAddress = process.env.EMPLOYEE_CONTRACT_ADDRESS;
  if (!employeeAddress) {
    throw new Error("Please set EMPLOYEE_CONTRACT_ADDRESS in your .env file");
  }

  console.log("Testing Employee status update functionality...");
  console.log("Contract address:", employeeAddress);

  // Get contract instance
  const Employee = await hre.ethers.getContractFactory("Employee");
  const employeeContract = Employee.attach(employeeAddress);

  // Test employee ID - this should be an existing employee ID from your database
  const testEmployeeId = "test-employee-" + Math.floor(Math.random() * 1000);
  const testName = "Test Employee";
  const testWallet = "0x0000000000000000000000000000000000000000"; // Zero address
  const testRole = "TESTER";
  const testDoj = "2023-05-01";
  const testDepartment = "TESTING";

  try {
    // First add an employee
    console.log(`Adding test employee with ID: ${testEmployeeId}...`);
    const addTx = await employeeContract.addEmployee(
      testEmployeeId,
      testName,
      testWallet,
      testRole,
      testDoj,
      testDepartment
    );
    
    await addTx.wait();
    console.log(`Employee added, transaction: ${addTx.hash}`);

    // Now update the employee's status
    console.log("Updating employee status to SUSPENDED...");
    const statusTx = await employeeContract.updateEmployeeStatus(
      testEmployeeId,
      "SUSPENDED",
      "Testing status update functionality"
    );
    
    await statusTx.wait();
    console.log(`Status updated, transaction: ${statusTx.hash}`);

    // Get the status records
    console.log("Fetching status records...");
    const statusRecords = await employeeContract.getStatusRecords(testEmployeeId);
    
    console.log(`Found ${statusRecords.length} status records:`);
    statusRecords.forEach((record, index) => {
      console.log(`Record ${index + 1}:`);
      console.log(`  Status: ${record.status}`);
      console.log(`  Reason: ${record.reason}`);
      console.log(`  Timestamp: ${new Date(Number(record.timestamp) * 1000).toISOString()}`);
    });

    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  }
}

// Execute the test
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 