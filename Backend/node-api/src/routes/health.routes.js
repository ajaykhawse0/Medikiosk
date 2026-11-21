const express = require('express');
const { getNodeHealth, getDependencies } = require('../controllers/health.controller');

const router = express.Router();

// Node.js API standalone health check
router.get('/', getNodeHealth);

// Node.js -> Spring Boot dependency health check
router.get('/dependencies', getDependencies);

module.exports = router;
