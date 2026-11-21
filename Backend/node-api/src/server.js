const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.PORT, () => {
  console.log('====================================================');
  console.log('  MediKiosk Node.js BFF (API Gateway)');
  console.log('====================================================');
  console.log(`>>> Service running on port:      ${env.PORT}`);
  console.log(`>>> Environment:                 ${env.NODE_ENV}`);
  console.log(`>>> Target Spring Boot URL:      ${env.SPRING_SERVICE_URL}`);
  console.log(`>>> Spring Service Timeout:      ${env.SPRING_SERVICE_TIMEOUT}ms`);
  console.log(`>>> Health Endpoint:             http://localhost:${env.PORT}/api/v1/health`);
  console.log(`>>> Dependencies Health:         http://localhost:${env.PORT}/api/v1/health/dependencies`);
  console.log('====================================================\n');
});

function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down MediKiosk Node BFF gracefully...`);
  server.close(() => {
    console.log('MediKiosk Node BFF HTTP server closed cleanly.');
    process.exit(0);
  });

  // Force shutdown after 10s if connections refuse to close
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
