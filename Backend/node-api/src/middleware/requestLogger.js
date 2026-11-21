/**
 * Lightweight, safe request logger middleware.
 * Logs method, path, status, and duration without logging passwords or authorization tokens.
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  const correlationId = req.correlationId || '-';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logLine = `[${new Date().toISOString()}] [${correlationId}] ${req.method} ${req.originalUrl || req.url} -> ${statusCode} (${duration}ms)`;
    
    if (statusCode >= 500) {
      console.error(logLine);
    } else if (statusCode >= 400) {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }
  });

  next();
}

module.exports = requestLogger;
