const crypto = require('crypto');

/**
 * Middleware to capture or generate a unique Correlation ID for distributed tracing.
 * Sets the ID on req.correlationId and returns it in the X-Correlation-ID response header.
 */
function correlationIdMiddleware(req, res, next) {
  const correlationId =
    req.headers['x-correlation-id'] ||
    req.headers['x-request-id'] ||
    crypto.randomUUID();

  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
}

module.exports = correlationIdMiddleware;
