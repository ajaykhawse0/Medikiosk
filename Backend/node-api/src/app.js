const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const correlationIdMiddleware = require('./middleware/correlationId');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Security and CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (env.CORS_ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID', 'X-Request-ID']
  })
);

// Standard parsers and tracing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(correlationIdMiddleware);
app.use(requestLogger);

// Health check convenience routes
app.use('/health', healthRoutes);

// Versioned API Routes (/api/v1/health, etc.)
app.use('/api/v1', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'node-api',
    role: 'Backend-for-Frontend (BFF) API Gateway',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      liveness: '/api/v1/health',
      dependencies: '/api/v1/health/dependencies'
    }
  });
});

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    correlationId: req.correlationId
  });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
