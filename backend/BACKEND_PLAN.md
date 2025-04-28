# 📱 STAFFI Backend Plan – Modular, Parallel, AI-Assistable

---

## 👥 Team Roles for Parallel Work

| Dev Role | Assigned Tasks |
|----------|----------------|
| **Dev 1 – Auth & Employee Modules** | HR wallet auth, employee CRUD, leave management |
| **Dev 2 – Web3 + AI** | Smart contract interaction, payroll logging, NFT minting, AI engine |

---

## 🏗️ Backend Milestones

---

### 🚩 Milestone 1: Project Bootstrap

- Set up folder structure:
  ```
  /backend
    ├── routes/
    ├── controllers/
    ├── services/
    ├── utils/
    └── index.js
  ```
- Shared setup of Express app

---

### 🔐 Milestone 2: Hybrid Auth System

**Dev 1**

- HR: Wallet-based login
  - Route: `POST /api/auth/hr-login`
  - Check wallet address in Supabase `hr_users`
- Employee: Supabase email/password auth
- Shared middleware for auth role checks

---

### 👥 Milestone 3: Employee Module

**Dev 1**

- Route: `POST /api/employee/request` (Employee Signup Request)
- Route: `GET /api/hr/employee-requests` (HR View Requests)
- Route: `POST /api/hr/employee-requests/:id/approve` (HR Approves Request)
- Route: `POST /api/hr/employee-requests/:id/reject` (HR Rejects Request)
- Route: `GET /api/employee/all`
- Route: `GET /api/employee/:id`
- Supabase Table: `employees` and `employee_requests`

---

### 🌴 Milestone 4: Leave Management (UPDATED)

**Dev 1**

- Route: `POST /api/leave/apply` (Employee)
- Route: `GET /api/leave/my-leaves` (Employee views own leaves)
- Route: `GET /api/leave/all` (HR views all leaves with filtering)
- Route: `POST /api/leave/:id/approve` (HR)
- Route: `POST /api/leave/:id/reject` (HR)
- Supabase Table: `leaves`
- Smart contract call on approval: `leaveApproved(employeeId, leaveDays, reason)`
  - **Key Change:** Records leaves on blockchain using employee ID instead of wallet
  - Works for all employees regardless of wallet status

---

### 💸 Milestone 5: Payroll Logging

**Dev 2**

- Route: `POST /api/payroll/send`
- Calls `Payroll.sol`
- Stores proof in Supabase `payrolls`

---

### 🏅 Milestone 6: NFT Minting

**Dev 2**

- Route: `POST /api/nft/mint`
- Mints certificate with `NFTCert.sol`
- Supabase Table: `certificates` (tokenId, empId, metadata)

---

### 🧠 Milestone 7: AI Prediction Engine

**Dev 2**

- Route: `POST /api/ai/predict`
- Calls OpenAI API
- Returns: risk level + recommendations
- Optional Table: `ai_logs`

---

### 🧪 Milestone 8: QA & Integration

**Shared**

- Middleware integration
- Route permissioning
- Postman tests
- Contract deployment with `.env` configs

---

## 🧠 Database Schema (Supabase)

### Table: `employees`

| Field       | Type     |
|-------------|----------|
| id          | UUID (PK)|
| name        | Text     |
| email       | Text     |
| password    | Text     |
| wallet      | Text     | <!-- Now optional -->
| role_id     | Int (FK) |
| department_id| Int (FK)|
| doj         | Date     |
| status      | Boolean  |

### Table: `employee_requests`

| Field       | Type     |
|-------------|----------|
| id          | UUID (PK)|
| name        | Text     |
| email       | Text     |
| password    | Text     |
| role_id     | Int (FK) |
| department_id| Int (FK)|
| status      | Text     |
| approved_by | UUID (FK hr_users) |
| approved_at | Timestamp|
| rejection_reason | Text |

---

### Table: `hr_users`

| Field       | Type     |
|-------------|----------|
| id          | UUID (PK)|
| wallet      | Text     |
| name        | Text     |
| email       | Text     |

---

### Table: `leaves`

| Field       | Type     |
|-------------|----------|
| id          | UUID (PK)|
| emp_id      | UUID (FK employees) |
| reason      | Text     |
| days        | Int      |
| status      | Text     |
| submitted_at| Timestamp|
| updated_at  | Timestamp|
| start_date  | Date     |
| approved_by | UUID (FK hr_users) |
| approved_at | Timestamp|
| rejected_by | UUID (FK hr_users) |
| rejected_at | Timestamp|
| rejection_reason | Text |

---

### Table: `payrolls`

| Field       | Type     |
|-------------|----------|
| id          | UUID (PK)|
| emp_id      | UUID (FK employees) |
| amount      | Float    |
| tx_hash     | Text     |
| timestamp   | Timestamp|

---

### Table: `certificates`

| Field       | Type     |
|-------------|----------|
| token_id    | Int      |
| emp_id      | UUID (FK employees) |
| skill_name  | Text     |
| token_uri   | Text     |

---

### Table: `ai_logs` (Optional)

| Field       | Type     |
|-------------|----------|
| id          | UUID (PK)|
| emp_id      | UUID (FK employees) |
| log_input   | JSON     |
| risk_level  | Text     |
| suggestions | JSON     |
| timestamp   | Timestamp|

---

## 🔁 Blockchain Integration (UPDATED)

### Leave Management
- When HR approves a leave request, the system calls `Employee.leaveApproved(employeeId, leaveDays, reason)`
- Blockchain records are indexed by employee ID (database UUID), NOT wallet address
- This allows all employees to have blockchain-verified leave records regardless of wallet status
- Wallets are optional and can be connected later via `updateEmployeeWallet` function

### Employee Registration
- When adding employees to the blockchain, use `addEmployee(employeeId, name, wallet, role, doj, department)`
- If employee has no wallet yet, use `address(0)` as wallet address

---

📅 Everything is modular  
📊 Everything is parallelizable  
💡 Every milestone is AI-agent friendly  

You're officially ready to build like a pro. 🏋️‍💻🌟

