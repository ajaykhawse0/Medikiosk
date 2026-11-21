const express = require('express');
const healthRoutes = require('./health.routes');

const router = express.Router();

// Health routes mounted under /api/v1/health
router.use('/health', healthRoutes);

module.exports = router;
