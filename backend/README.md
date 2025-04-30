# STAFFI Backend

## Overview

The STAFFI backend provides a RESTful API for the STAFFI HR Management System. It integrates with blockchain technology to provide immutable records of critical HR data.

## Current Implementation Status

| Module | Status | Notes |
|--------|--------|-------|
| **Authentication** | ✅ Implemented | HR login with wallet, Employee login with credentials |
| **Employee Management** | ✅ Implemented | CRUD operations, blockchain integration |
| **Leave Management** | ✅ Implemented | Apply, approve/reject with blockchain verification |
| **Payroll Management** | 🚧 Planned | Smart contract integration pending |
| **Certificate (NFT)** | 🚧 Planned | ERC721 integration pending |
| **AI Analytics** | 🚧 Planned | OpenAI integration pending |

## Recent Refactoring

The codebase has been refactored to improve organization and maintainability:

1. **Service Layer**: Added dedicated service classes for:
   - `blockchainService.js` - Smart contract interactions
   - `supabaseService.js` - Database operations

2. **Route Organization**: Consolidated and organized route files
   - Removed duplicate endpoints
   - Organized routes by functionality and permission level

3. **Documentation**: Added comprehensive API documentation
   - See `API_DOCUMENTATION.md` for full details
   - Individual module documentation files (e.g., `LEAVE_MANAGEMENT_API.md`)

## Getting Started

### Prerequisites

- Node.js v16+
- Supabase account
- Ethereum wallet with private key
- Access to Ethereum node (Infura, Alchemy, etc.)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Create `.env` file (see `.env.example` for required variables)
4. Initialize database:
   ```
   npm run db:init
   ```
5. Start the server:
   ```
   npm start
   ```

### Environment Variables

See `.env.example` for a complete list of required variables:

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development, test, production)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration (default: "24h")
- `ETHEREUM_RPC_URL` - Ethereum RPC endpoint
- `PRIVATE_KEY` - Private key for contract interactions
- `EMPLOYEE_CONTRACT_ADDRESS` - Deployed Employee contract address
- `INFURA_API_KEY` - (Optional) Infura API key

## API Documentation

See `API_DOCUMENTATION.md` for a comprehensive list of all endpoints.

## Smart Contract Integration

The backend integrates with the following smart contracts:

1. **Employee.sol** (Implemented)
   - Store employee records with database ID as primary key
   - Track leave history on-chain

2. **Payroll.sol** (Planned)
   - Record proof of salary payments

3. **NFTCert.sol** (Planned)
   - Mint certificate NFTs for employee achievements

## Testing

Run the test suite with:

```
npm test
```

For development with continuous testing:

```
npm run test:watch
```

## Next Steps

1. **Service Layer Completion**:
   - Implement `payrollService.js`
   - Implement `certificateService.js`
   - Implement `aiService.js`

2. **New Feature Implementation**:
   - Complete Payroll module
   - Complete NFT Certificate module
   - Implement AI Analytics

3. **Performance Improvements**:
   - Add response caching
   - Implement background processing for blockchain operations

## License

This project is proprietary and confidential. 