const hre = require("hardhat");

async function main() {
  // Get the Employee contract address from .env
  const employeeAddress = process.env.EMPLOYEE_CONTRACT_ADDRESS;
  if (!employeeAddress) {
    throw new Error("Please set EMPLOYEE_CONTRACT_ADDRESS in your .env file");
  }

  console.log("Deploying Payroll contract...");
  console.log("Using Employee contract at:", employeeAddress);

  const Payroll = await hre.ethers.getContractFactory("Payroll");
  const payroll = await Payroll.deploy(employeeAddress);
  await payroll.waitForDeployment();

  const address = await payroll.getAddress();
  console.log("Payroll contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 