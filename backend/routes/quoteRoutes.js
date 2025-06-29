const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const authenticateToken = require('../middleware/auth'); // Assume this is where JWT middleware is defined

// POST /api/quote - Generate and store a quotation
router.post('/quote', authenticateToken, quoteController.generateQuote);

module.exports = quoteRoutes;