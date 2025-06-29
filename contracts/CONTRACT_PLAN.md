# 🧰 STAFFI Smart Contract Plan – Milestone-Based with Full Breakdown

---

## 🧬 Overview

STAFFI uses smart contracts to bring trust, traceability, and transparency to HR data. We will write, deploy, and interact with 3 contracts:

| Contract        | Purpose                                   |
|----------------|--------------------------------------------|
| `Employee.sol` | Store employee data and leave records with optional wallet integration |
| `Payroll.sol`  | Record salary payout proofs                |
| `NFTCert.sol`  | Mint NFT certificates for achievements     |

---

## 🏁 Milestone Plan

Each milestone can be worked on independently and supported by an AI agent.

---

### 🚩 Milestone 1: Contract Workspace Setup

**Goal:** Initialize project using Hardhat.

| Task | Description |
|------|-------------|
| Init Hardhat | `npx hardhat init` to set up smart contract dev env |
| Install OpenZeppelin | `npm install @openzeppelin/contracts` for NFT, Ownable |
| Add `.env` | Configure `RPC_URL`, `PRIVATE_KEY`, `EXPLORER_API_KEY` |
| Configure networks | Update `hardhat.config.js` for Mumbai testnet |

---

### 🔐 Milestone 2: Build `Employee.sol` (UPDATED)

**Goal:** Smart contract to store employee records with database ID as primary key and leave tracking.

**Data Structures:**
```solidity
struct Record {
  string employeeId;  // Database ID as primary identifier
  string name;
  address wallet;     // Can be address(0) if not connected
  string role;
  string doj;
  string department;
}

// Map employee IDs to records
mapping(string => Record) public employeesByID;
    
// Secondary index: wallet -> employeeId (only for employees with wallets)
mapping(address => string) public walletToEmployeeId;
    
// Track existing employee IDs
mapping(string => bool) public isEmployee;

// Leave tracking
struct LeaveRecord {
  uint256 leaveDays;  // Using leaveDays instead of days (reserved word)
  string reason;
  uint256 timestamp;
}
    
// Store leave records per employee ID
mapping(string => LeaveRecord[]) public leaveRecords;
```

**Events:**
```solidity
event EmployeeAdded(string indexed employeeId, string name, address wallet);
event EmployeeWalletUpdated(string indexed employeeId, address newWallet);
event LeaveApproved(string indexed employeeId, uint256 leaveDays, string reason);
```

**Functions:**
| Function | Signature | Description |
|----------|-----------|-------------|
| `addEmployee(...)` | `(string memory employeeId, string memory name, address wallet, string memory role, string memory doj, string memory department)` | Add employee record with optional wallet. Reverts if ID already exists. |
| `updateEmployeeWallet(...)` | `(string memory employeeId, address newWallet)` | Update or add wallet address for existing employee |
| `getEmployeeById(...)` | `(string memory employeeId) view returns (Record memory)` | Get employee data by ID |
| `getEmployeeByWallet(...)` | `(address wallet) view returns (Record memory)` | Get employee data by wallet address |
| `leaveApproved(...)` | `(string memory employeeId, uint256 leaveDays, string memory reason)` | Record leave approval on-chain |
| `getLeaveRecords(...)` | `(string memory employeeId) view returns (LeaveRecord[] memory)` | Get all leave records for an employee |

---

### 💸 Milestone 3: Build `Payroll.sol`

**Goal:** Contract that logs payment proof via events.

**Events:**
```solidity
event SalarySent(address indexed emp, uint256 amount, uint256 timestamp);
```

**Functions:**
| Function | Signature | Description |
|----------|-----------|-------------|
| `logPayroll(...)` | `(address emp, uint256 amount) external` | Emits `SalarySent` event with current `block.timestamp` |

---

### 🏅 Milestone 4: Build `NFTCert.sol`

**Goal:** Mint verifiable NFT certificates using OpenZeppelin ERC721.

**Inherits:** `ERC721`, `Ownable`, `Counters`

**Events:**
```solidity
event CertificateMinted(address indexed to, uint256 tokenId, string tokenURI);
```

**Functions:**
| Function | Signature | Description |
|----------|-----------|-------------|
| `mintCertificate(...)` | `(address to, string memory tokenURI) external onlyOwner` | Mints a new NFT cert to `to`, emits event |
| `getTokenURI(...)` | `(uint256 tokenId) public view returns (string memory)` | Returns metadata URI of a certificate |

---

### 🚀 Milestone 5: Write Deployment Scripts

| File | Description |
|------|-------------|
| `scripts/deployEmployee.js` | Deploy Employee contract |
| `scripts/deployPayroll.js` | Deploy Payroll contract |
| `scripts/deployNFTCert.js` | Deploy NFTCert contract |
| Use CLI | `npx hardhat run scripts/deployXYZ.js --network mumbai` |

---

### 🔹 Milestone 6: ABI Extraction & Backend Integration

| Task | Description |
|------|-------------|
| Compile Contracts | `npx hardhat compile` to generate `artifacts/` folder |
| Copy ABIs | Copy relevant JSON ABIs to `backend/abi/` folder |
| Setup service | Use ethers.js with signer to connect and call contracts |

---

### 🚦 Milestone 7: Verification & Testing

| Task | Description |
|------|-------------|
| Mumbai Deployment | Deploy contracts on Polygon testnet |
| Verify Contracts | Use Hardhat's `verify` plugin with Polygonscan |
| Test Functions | Use Hardhat console or scripts to test contract methods |
| Record Explorer Links | Save Mumbai contract links for demo + backend |

---

## 🏃‍♂️ You Are Now Fully Equipped

This plan is modular, parallelizable, and AI-agent-friendly. You can delegate any milestone, test in isolation, and plug in from backend or frontend with full clarity.