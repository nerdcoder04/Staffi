# STAFFI Backend

## 🚀 Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key

# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Blockchain Configuration
RPC_URL=your-polygon-rpc-url
WALLET_PRIVATE_KEY=your-wallet-private-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
```

3. Get the required API keys:

### Supabase Setup
1. Go to https://supabase.com
2. Create a new project
3. Get the `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings > API

### OpenAI Setup
1. Go to https://platform.openai.com
2. Create an account and get your API key
3. Store it as `OPENAI_API_KEY`

### Blockchain Setup
1. For development: Use Polygon Mumbai testnet
2. Get RPC URL from https://polygon-rpc.com
3. Create a wallet using MetaMask or similar
4. Get some test MATIC from Mumbai faucet
5. Export private key (carefully!) and store as `WALLET_PRIVATE_KEY`

## 🏃‍♂️ Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📚 API Documentation

### Authentication Endpoints

#### HR Login
```http
POST /api/auth/hr-login
Content-Type: application/json

{
  "walletAddress": "0x..."
}
```

#### Employee Login
```http
POST /api/auth/employee-login
Content-Type: application/json

{
  "email": "employee@example.com",
  "password": "password123"
}
```

#### HR Registration
```http
POST /api/auth/hr-register
Content-Type: application/json

{
  "walletAddress": "0x...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
```

### Protected Routes

All protected routes require a JWT token in the Authorization header:
```http
Authorization: Bearer <token>
```

## 🔒 Security Notes

1. Never commit your `.env` file
2. Keep your private keys secure
3. Use HTTPS in production
4. Implement rate limiting in production
5. Regularly rotate JWT secrets

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📝 Logging

Logs are stored in the `logs` directory:
- `error.log`: Error logs
- `combined.log`: All logs

## 🔄 Blockchain Integration

The backend includes fallback mechanisms for blockchain operations. If a blockchain operation fails, the system will:
1. Log the error
2. Continue with database operations
3. Mark the operation for retry
4. Notify administrators

## 🤖 AI Integration

The AI module uses OpenAI's GPT-3.5-turbo model to:
1. Analyze employee engagement
2. Predict performance trends
3. Suggest HR actions

## 📊 Database Schema

See `BACKEND_PLAN.md` for the complete database schema. 