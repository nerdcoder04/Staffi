const hre = require("hardhat");

async function main() {
  const employeeAddress = process.env.EMPLOYEE_CONTRACT_ADDRESS;
  if (!employeeAddress) {
    throw new Error("Please set EMPLOYEE_CONTRACT_ADDRESS in your .env file");
  }

  console.log("Testing Employee contract at:", employeeAddress);

  // Get the contract instance
  const Employee = await hre.ethers.getContractFactory("Employee");
  const employee = Employee.attach(employeeAddress);

  // Test adding an employee
  console.log("\nTesting addEmployee function...");
  const testEmployee = {
    wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Example address
    name: "John Doe",
    role: "Software Engineer",
    doj: "2024-03-25",
    department: "Engineering"
  };

  try {
    const tx = await employee.addEmployee(
      testEmployee.wallet,
      testEmployee.name,
      testEmployee.role,
      testEmployee.doj,
      testEmployee.department
    );
    await tx.wait();
    console.log("✅ Employee added successfully!");

    // Test getting employee details
    console.log("\nTesting getEmployee function...");
    const employeeDetails = await employee.getEmployee(testEmployee.wallet);
    console.log("Employee Details:");
    console.log("Name:", employeeDetails.name);
    console.log("Role:", employeeDetails.role);
    console.log("Department:", employeeDetails.department);
    console.log("Date of Joining:", employeeDetails.doj);
    console.log("Wallet:", employeeDetails.wallet);

  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 