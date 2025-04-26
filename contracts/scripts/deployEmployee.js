const hre = require("hardhat");

async function main() {
  console.log("Deploying Employee contract...");

  const Employee = await hre.ethers.getContractFactory("Employee");
  const employee = await Employee.deploy();
  await employee.waitForDeployment();

  const address = await employee.getAddress();
  console.log("Employee contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 