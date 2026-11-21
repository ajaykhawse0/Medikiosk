const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function parsePort(value, defaultPort) {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 65535 ? parsed : defaultPort;
}

function parseOrigins(value, defaultOrigins) {
  if (!value) return defaultOrigins;
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const env = Object.freeze({
  PORT: parsePort(process.env.PORT, 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  SPRING_SERVICE_URL: (process.env.SPRING_SERVICE_URL || 'http://localhost:8081').replace(/\/+$/, ''),
  SPRING_SERVICE_TIMEOUT: parseInt(process.env.SPRING_SERVICE_TIMEOUT, 10) || 5000,
  SERVICE_API_KEY: process.env.SERVICE_API_KEY || '',
  CORS_ALLOWED_ORIGINS: parseOrigins(
    process.env.CORS_ALLOWED_ORIGINS,
    ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']
  )
});

module.exports = env;
