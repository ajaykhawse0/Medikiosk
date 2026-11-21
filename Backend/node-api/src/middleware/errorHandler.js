const env = require('../config/env');

/**
 * Centralized Express Error Handling Middleware.
 * Standardizes API error responses and prevents leakage of internal stack traces or secrets.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const correlationId = req.correlationId || 'N/A';

  // Safe error logging without sensitive request dumps
  console.error(`[${new Date().toISOString()}] [${correlationId}] ERROR: ${err.message}`);
  if (env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }

  const responseBody = {
    success: false,
    message: err.message || 'An internal server error occurred',
    correlationId
  };

  // Provide details only when safely structured and not leaking credentials
  if (err.details && typeof err.details === 'object' && !Array.isArray(err.details)) {
    responseBody.details = err.details;
  }

  res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
