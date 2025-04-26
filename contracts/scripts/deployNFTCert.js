const hre = require("hardhat");

async function main() {
  // Get the Employee contract address from .env
  const employeeAddress = process.env.EMPLOYEE_CONTRACT_ADDRESS;
  if (!employeeAddress) {
    throw new Error("Please set EMPLOYEE_CONTRACT_ADDRESS in your .env file");
  }

  console.log("Deploying NFTCert contract...");
  console.log("Using Employee contract at:", employeeAddress);

  const NFTCert = await hre.ethers.getContractFactory("NFTCert");
  const nftCert = await NFTCert.deploy(employeeAddress);
  await nftCert.waitForDeployment();

  const address = await nftCert.getAddress();
  console.log("NFTCert contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 