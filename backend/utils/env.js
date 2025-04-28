/**
 * Environment loader utility
 * Loads environment variables from .env file
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const logger = require('./logger');

// Load environment variables from .env file
const loadEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Possible .env file locations (in order of preference)
  const envPaths = [
    path.resolve(process.cwd(), '.env'),               // current directory
    path.resolve(process.cwd(), '../.env'),            // parent directory
    path.resolve(process.cwd(), `../.env.${nodeEnv}`), // env-specific in parent
    path.resolve(process.cwd(), `.env.${nodeEnv}`)     // env-specific in current
  ];
  
  // Try loading from each possible location
  let envLoaded = false;
  
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      console.log(`Loading environment from: ${envPath}`);
      dotenv.config({ path: envPath });
      envLoaded = true;
      // Don't break, allow later files to override earlier ones
    }
  }
  
  if (!envLoaded) {
    console.warn('No .env file found in any of the expected locations');
  }
  
  // Validate required environment variables after loading logger
  if (logger) {
    setTimeout(() => {
      // Check for Supabase credentials instead of PostgreSQL
      const requiredEnvVars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'JWT_SECRET',
        'EMPLOYEE_CONTRACT_ADDRESS',
        'PRIVATE_KEY',
        'INFURA_API_KEY'
      ];
      
      const missingEnvVars = requiredEnvVars.filter(
        envVar => !process.env[envVar]
      );
      
      if (missingEnvVars.length > 0) {
        logger.warn(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
      }
    }, 1000);
  }
};

module.exports = { loadEnv }; 