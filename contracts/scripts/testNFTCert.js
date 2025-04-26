const hre = require("hardhat");

async function main() {
  const nftCertAddress = process.env.NFTCERT_CONTRACT_ADDRESS;
  if (!nftCertAddress) {
    throw new Error("Please set NFTCERT_CONTRACT_ADDRESS in your .env file");
  }

  console.log("Testing NFTCert contract at:", nftCertAddress);

  // Get the contract instance
  const NFTCert = await hre.ethers.getContractFactory("NFTCert");
  const nftCert = NFTCert.attach(nftCertAddress);

  // Test minting a certificate
  console.log("\nTesting mintCertificate function...");
  const testCert = {
    employeeWallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Same as in Employee test
    tokenURI: "ipfs://QmExample..." // Example IPFS URI for certificate metadata
  };

  try {
    const tx = await nftCert.mintCertificate(
      testCert.employeeWallet,
      testCert.tokenURI
    );
    await tx.wait();
    console.log("✅ Certificate minted successfully!");

    // Get token URI
    const tokenId = 0; // First token
    const uri = await nftCert.tokenURI(tokenId);
    console.log("\nToken URI for ID 0:", uri);

  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 