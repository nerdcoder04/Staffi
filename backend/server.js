/**
 * Server entry point
 * Loads environment variables and starts the application
 */

// Load environment variables first - must be done before importing app
require('./utils/env').loadEnv();

const logger = require('./utils/logger');
const app = require('./app');

// Start server
const PORT = process.env.PORT || 3001;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exit with failure
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // For now, log the rejection but don't crash the app
});

// Handle termination signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  console.log('SIGTERM received. Shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully');
  console.log('SIGINT received. Shutting down gracefully');
  process.exit(0);
});

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
  
  module.exports = server;
} else {
  // Export app without starting server in test mode
  module.exports = app;
} 