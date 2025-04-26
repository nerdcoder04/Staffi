const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("STAFFI Contracts (Sepolia Network)", function () {
  // Increase timeout for Sepolia network
  this.timeout(120000); // 120 seconds

  let Employee, Payroll, NFTCert;
  let employee, payroll, nftCert;
  let owner, addr1, addr2;
  const testURI = "ipfs://QmTest";

  beforeEach(async function () {
    // Get signers differently for Sepolia
    const signers = await ethers.getSigners();
    owner = signers[0];
    addr1 = signers[0]; // Using same account since we only have one on Sepolia
    addr2 = signers[0]; // Using same account since we only have one on Sepolia

    console.log("Deploying contracts with account:", await owner.getAddress());
    console.log("Account balance:", (await ethers.provider.getBalance(await owner.getAddress())).toString());

    // Deploy Employee contract
    Employee = await ethers.getContractFactory("Employee");
    employee = await Employee.deploy();
    console.log("Employee contract deployed to:", await employee.getAddress());
    await employee.waitForDeployment();

    // Deploy Payroll contract
    Payroll = await ethers.getContractFactory("Payroll");
    payroll = await Payroll.deploy(await employee.getAddress());
    console.log("Payroll contract deployed to:", await payroll.getAddress());
    await payroll.waitForDeployment();

    // Deploy NFTCert contract
    NFTCert = await ethers.getContractFactory("NFTCert");
    nftCert = await NFTCert.deploy(await employee.getAddress());
    console.log("NFTCert contract deployed to:", await nftCert.getAddress());
    await nftCert.waitForDeployment();
  });

  describe("Employee Contract", function () {
    const employeeData = {
      name: "John Doe",
      role: "Developer",
      doj: "2024-03-15",
      department: "Engineering"
    };

    it("Should add a new employee", async function () {
      const employeeAddress = await addr1.getAddress();
      await employee.addEmployee(
        employeeAddress,
        employeeData.name,
        employeeData.role,
        employeeData.doj,
        employeeData.department
      );

      const emp = await employee.getEmployee(employeeAddress);
      expect(emp.name).to.equal(employeeData.name);
      expect(emp.role).to.equal(employeeData.role);
      expect(emp.doj).to.equal(employeeData.doj);
      expect(emp.department).to.equal(employeeData.department);
      expect(await employee.isEmployee(employeeAddress)).to.be.true;
    });

    it("Should prevent duplicate employee addition", async function () {
      const employeeAddress = await addr1.getAddress();
      await employee.addEmployee(
        employeeAddress,
        employeeData.name,
        employeeData.role,
        employeeData.doj,
        employeeData.department
      );

      await expect(
        employee.addEmployee(
          employeeAddress,
          employeeData.name,
          employeeData.role,
          employeeData.doj,
          employeeData.department
        )
      ).to.be.revertedWith("Employee already exists");
    });

    it("Should fail to get non-existent employee", async function () {
      const nonExistentAddress = await addr2.getAddress();
      await expect(
        employee.getEmployee(nonExistentAddress)
      ).to.be.revertedWith("Employee does not exist");
    });
  });

  describe("Payroll Contract", function () {
    const salary = ethers.parseEther("1.0");

    beforeEach(async function () {
      const employeeAddress = await addr1.getAddress();
      await employee.addEmployee(
        employeeAddress,
        "John Doe",
        "Developer",
        "2024-03-15",
        "Engineering"
      );
    });

    it("Should log payroll for valid employee", async function () {
      const employeeAddress = await addr1.getAddress();
      const tx = await payroll.logPayroll(employeeAddress, salary);
      const receipt = await tx.wait();
      const event = receipt.logs[0];
      const decodedEvent = payroll.interface.parseLog(event);
      
      expect(decodedEvent.name).to.equal("SalarySent");
      expect(decodedEvent.args[0]).to.equal(employeeAddress);
      expect(decodedEvent.args[1]).to.equal(salary);
      expect(typeof decodedEvent.args[2]).to.equal("bigint");
    });

    it("Should fail to log payroll for invalid employee", async function () {
      const invalidAddress = await addr2.getAddress();
      await expect(
        payroll.logPayroll(invalidAddress, salary)
      ).to.be.revertedWith("Not a valid employee");
    });
  });

  describe("NFTCert Contract", function () {
    beforeEach(async function () {
      const employeeAddress = await addr1.getAddress();
      await employee.addEmployee(
        employeeAddress,
        "John Doe",
        "Developer",
        "2024-03-15",
        "Engineering"
      );
    });

    it("Should mint certificate for valid employee", async function () {
      const employeeAddress = await addr1.getAddress();
      await expect(nftCert.mintCertificate(employeeAddress, testURI))
        .to.emit(nftCert, "CertificateMinted")
        .withArgs(employeeAddress, 0, testURI);

      expect(await nftCert.ownerOf(0)).to.equal(employeeAddress);
      expect(await nftCert.tokenURI(0)).to.equal(testURI);
    });

    it("Should fail to mint certificate for invalid employee", async function () {
      const invalidAddress = await addr2.getAddress();
      await expect(
        nftCert.mintCertificate(invalidAddress, testURI)
      ).to.be.revertedWith("Not a valid employee");
    });

    it("Should have correct name and symbol", async function () {
      expect(await nftCert.name()).to.equal("STAFFI Certificates");
      expect(await nftCert.symbol()).to.equal("CERT");
    });
  });

  describe("Access Control", function () {
    it("Should prevent non-owner from adding employee", async function () {
      const nonOwnerAddress = await addr1.getAddress();
      const employeeAddress = await addr2.getAddress();
      await expect(
        employee.connect(addr1).addEmployee(
          employeeAddress,
          "Jane Doe",
          "Designer",
          "2024-03-15",
          "Design"
        )
      ).to.be.revertedWithCustomError(employee, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from logging payroll", async function () {
      const employeeAddress = await addr2.getAddress();
      await expect(
        payroll.connect(addr1).logPayroll(employeeAddress, ethers.parseEther("1.0"))
      ).to.be.revertedWithCustomError(payroll, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from minting certificate", async function () {
      const employeeAddress = await addr2.getAddress();
      await expect(
        nftCert.connect(addr1).mintCertificate(employeeAddress, testURI)
      ).to.be.revertedWithCustomError(nftCert, "OwnableUnauthorizedAccount");
    });
  });

  describe("Data Persistence", function () {
    it("Should persist employee data on chain", async function () {
      const employeeAddress = await addr1.getAddress();
      
      // Add employee
      await employee.addEmployee(
        employeeAddress,
        "John Doe",
        "Developer",
        "2024-03-15",
        "Engineering"
      );

      // Verify storage directly from blockchain
      const storedEmployee = await employee.employees(employeeAddress);
      expect(storedEmployee.name).to.equal("John Doe");
      expect(storedEmployee.role).to.equal("Developer");
      expect(storedEmployee.doj).to.equal("2024-03-15");
      expect(storedEmployee.department).to.equal("Engineering");

      // Verify payroll event storage
      const salary = ethers.parseEther("1.0");
      const tx = await payroll.logPayroll(employeeAddress, salary);
      const receipt = await tx.wait();
      
      // Get event from blockchain logs
      const event = receipt.logs[0];
      const decodedEvent = payroll.interface.parseLog(event);
      expect(decodedEvent.args[0]).to.equal(employeeAddress);
      expect(decodedEvent.args[1]).to.equal(salary);

      // Verify NFT storage
      const tokenURI = "ipfs://QmTest";
      await nftCert.mintCertificate(employeeAddress, tokenURI);
      expect(await nftCert.tokenURI(0)).to.equal(tokenURI);
      expect(await nftCert.ownerOf(0)).to.equal(employeeAddress);
    });
  });
}); 