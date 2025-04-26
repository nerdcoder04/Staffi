const hre = require("hardhat");

async function main() {
  const payrollAddress = process.env.PAYROLL_CONTRACT_ADDRESS;
  if (!payrollAddress) {
    throw new Error("Please set PAYROLL_CONTRACT_ADDRESS in your .env file");
  }

  console.log("Testing Payroll contract at:", payrollAddress);

  // Get the contract instance
  const Payroll = await hre.ethers.getContractFactory("Payroll");
  const payroll = Payroll.attach(payrollAddress);

  // Test logging a payroll event
  console.log("\nTesting logPayroll function...");
  const testPayroll = {
    employeeWallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Same as in Employee test
    amount: hre.ethers.parseEther("1.5") // 1.5 ETH as example amount
  };

  try {
    const tx = await payroll.logPayroll(
      testPayroll.employeeWallet,
      testPayroll.amount
    );
    await tx.wait();
    console.log("✅ Payroll event logged successfully!");

    // Get the employee contract address
    const employeeContractAddress = await payroll.getEmployeeContract();
    console.log("\nEmployee Contract Address:", employeeContractAddress);

  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 