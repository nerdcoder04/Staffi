/**
 * Logger utility
 * Configures and exports a Winston logger instance
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure log directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Create the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'staffi-backend' },
  transports: [
    // Write to all logs with level 'info' and below to combined.log
    new transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      level: 'info'
    }),
    // Write all logs with level 'error' and below to error.log
    new transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    })
  ]
});

// Add console transport in development environment
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger; 