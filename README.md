# STAFFI: Full Project Blueprint

## 🏷 Project Name

**STAFFI**\
"Web3-Enabled HR Management System with AI-Powered Workforce Analytics"

---

## 🎯 Abstract

STAFFI aims to revolutionize human resource management by combining blockchain's immutability and AI's analytical power. The platform empowers organizations to manage employee records, analyze performance, automate payrolls, and issue trustless certifications.

It integrates:

- **Blockchain** to securely store sensitive HR data such as employment records, leave approvals, and payroll events.
- **AI** to predict employee engagement levels and suggest proactive HR strategies.
- **NFTs** to issue verifiable, immutable proof of certifications and achievements.

---

## 💻 Recommended Platform

**Web Application** (Vite + React) — lightweight, fast, and optimized for rapid development and deployment.

---

## 🧠 Core Modules and Functionality

| Module                | Description                         | Backend     | Blockchain              | AI               |
| --------------------- | ----------------------------------- | ----------- | ----------------------- | ---------------- |
| Auth & Wallet Connect | HR/Admin login using wagmi + wallet | ✅           | ❌                       | ❌                |
| Employee Management   | Add/edit employee data              | ✅           | ✅ (final snapshot only) | ❌                |
| Leave Management      | Apply and approve leaves            | ✅           | ✅ (after approval)      | ❌                |
| Payroll Automation    | Log salary events                   | ✅ (trigger) | ✅ (recorded as proof)   | ❌                |
| Performance Analytics | Predict engagement with OpenAI      | ✅           | ❌                       | ✅                |
| Certificate NFTs      | Issue NFTs for achievements         | ✅           | ✅ (ERC721 standard)     | ❌                |
| Feedback System       | Anonymous encrypted feedback        | ✅           | ❌ (or optional)         | ❌                |
| Admin Dashboard       | Unified UI for all HR functions     | ✅           | ❌                       | ✅ (for insights) |

---

## 🧱 Tech Stack

| Layer                 | Tool               | Install Command                                   |
| --------------------- | ------------------ | ------------------------------------------------- |
| Frontend              | Vite + React       | `npm create vite@latest`                          |
| Styling               | TailwindCSS        | `npm install -D tailwindcss postcss autoprefixer` |
| UI Components         | Shadcn/UI          | `npx shadcn-ui@latest init`                       |
| Wallet                | wagmi + viem       | `npm install wagmi viem @rainbow-me/rainbowkit`   |
| Backend               | Express.js         | `npm install express cors dotenv`                 |
| Database              | Supabase           | `npm install @supabase/supabase-js`               |
| Blockchain            | Solidity + Hardhat | `npm install --save-dev hardhat`                  |
| Smart Contract Access | ethers.js          | `npm install ethers`                              |
| AI Engine             | OpenAI             | `npm install openai`                              |

---

## 🗂 Folder Structure

```bash
STAFFI/
├── frontend/
│   └── src/
│       ├── components/        # Reusable UI components (Buttons, Cards, etc.)
│       ├── pages/             # Route-based views (Dashboard, Leave, AI, etc.)
│       ├── styles/            # Tailwind and custom CSS files
│       ├── utils/             # wagmi config, helpers, constants
│       └── config/            # App-level configs and API URLs
├── backend/
│   ├── controllers/           # Logic for handling route operations
│   ├── routes/                # Route definitions for Express
│   ├── models/                # Optional: schema definitions
│   ├── services/              # Supabase, OpenAI, and blockchain logic
│   └── index.js               # Main Express server file
├── contracts/
│   ├── Employee.sol           # Immutable employee data
│   ├── Payroll.sol            # Payroll event recorder
│   └── NFTCert.sol            # Certificate NFT logic
├── scripts/
│   ├── deploy.js              # Smart contract deployment
│   └── utils.js               # Utility scripts for deployment
├── ai-engine/
│   └── openai-predict.js      # AI logic to format and send prompts
└── README.md
```

---

## 🔄 Functional Flows

### Employee Creation

- HR fills out the form.
- Backend stores data in Supabase.
- Backend optionally signs and sends a blockchain transaction to snapshot the data.

### Leave Application

- Employee submits leave request.
- HR reviews and approves in the dashboard.
- Backend records approval to the blockchain.

### Payroll Event Logging

- Manual or scheduled backend trigger.
- Logs payout details to Payroll smart contract as immutable proof.
- Does not send actual crypto — just verifies the salary event.

### AI-Powered Performance Insights

- Backend sends structured prompt to OpenAI.
- Returns engagement risk level and recommendations.
- Results are displayed in the dashboard.

---

## 🔐 Smart Contracts

| Contract       | Description                                  |
| -------------- | -------------------------------------------- |
| `Employee.sol` | Stores immutable employee records            |
| `Payroll.sol`  | Records salary payout proofs on-chain        |
| `NFTCert.sol`  | Mints NFT certificates using ERC721 standard |

---

## 🤖 AI Module

- Collects behavioral and performance logs.
- Formats input as a prompt to OpenAI.
- Parses response to show:
  - Risk level (Low / Medium / High)
  - 2–3 HR action recommendations
- Exposed via backend route: `/predict`

---

## 🚀 Deployment Setup

- **Frontend**: Netlify
- **Backend**: Railway
- **Smart Contracts**: Hardhat + Polygon Mumbai
- **Secrets & Keys**: `.env` file including:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - RPC_URL
  - PRIVATE_KEY
  - OPENAI_API_KEY

---

## ✅ Demo-Day Checklist

- 3 end-to-end working flows (Employee Add, Leave Approval, AI Insight)
- Live or screenshot fallback for each feature
- Wallets pre-funded with Mumbai testnet MATIC
- Clean and rehearsed 2-minute pitch

---

## 🚨 Final Notes

- All smart contract calls are handled by the backend.
- HR and staff **never interact directly with wallets or gas fees**.
- Only critical operations are written to the blockchain.
- Design is clean, intuitive, and optimized for non-technical HR users.

---

## 👥 Team Responsibilities

### 🕷 Spider – Blockchain Architect & Contract Integrator

- Build and deploy: `Employee.sol`, `Payroll.sol`, `NFTCert.sol`
- Handle smart contract triggers
- Share ABI & addresses with backend

### 💻 Uttam – Frontend Lead & UI Architect

- Set up Vite, Tailwind, Shadcn UI
- Implement wallet connection and protected routes
- Build core pages: Login, Dashboard, AI, Certificates
- Connect to backend APIs for real-time updates

### 🛠 Scutum – Backend Engineer & Logic Dev

- Build Express server structure
- Implement routes: `/add-employee`, `/leave`, `/payroll`, `/predict`
- Integrate Supabase and ethers.js
- Securely manage server wallet & blockchain access

### 🤖 Sasuke – AI Specialist & QA Champion

- Structure OpenAI prompts and backend integration
- Run end-to-end testing for flows
- Backup all demo assets and record testnet data

---

> STAFFI isn’t just a hackathon project. It’s a blueprint for future-ready, AI-enhanced, blockchain-secure HR technology.

**Go build the legend. 🚀**

