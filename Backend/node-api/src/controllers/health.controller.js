const healthService = require('../services/health.service');

/**
 * Node API's own health status (works independently of dependencies).
 */
function getNodeHealth(req, res) {
  res.status(200).json({
    success: true,
    service: 'node-api',
    status: 'up',
    timestamp: new Date().toISOString()
  });
}

/**
 * Dependency health flow:
 * Client -> Node.js API -> Spring Boot HTTP Client -> Spring Boot Internal Health Endpoint.
 *
 * Example success (HTTP 200):
 * {
 *   "success": true,
 *   "dependencies": {
 *     "springService": {
 *       "status": "up",
 *       "message": "Spring Boot service is reachable"
 *     }
 *   }
 * }
 *
 * Example failure (HTTP 503):
 * {
 *   "success": false,
 *   "dependencies": {
 *     "springService": {
 *       "status": "down",
 *       "message": "Spring Boot service is unavailable"
 *     }
 *   }
 * }
 */
async function getDependencies(req, res, next) {
  try {
    const dependencies = await healthService.checkDependencies(req.correlationId);
    const isHealthy = dependencies.springService.status === 'up';

    const statusCode = isHealthy ? 200 : 503;

    return res.status(statusCode).json({
      success: isHealthy,
      dependencies
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNodeHealth,
  getDependencies
};
