const hre = require("hardhat");

async function main() {
  console.log("Deploying updated Employee contract with status tracking...");

  // Get the Contract Factory
  const Employee = await hre.ethers.getContractFactory("Employee");
  
  // Deploy the contract
  const employee = await Employee.deploy();
  
  // Wait for deployment to finish
  await employee.waitForDeployment();
  
  const address = await employee.getAddress();
  console.log("Updated Employee contract deployed to:", address);
  
  // Wait a bit for Etherscan to index the contract
  console.log("Waiting for Etherscan to index the contract...");
  await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
  
  // Verify contract on Etherscan
  try {
    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan!");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 