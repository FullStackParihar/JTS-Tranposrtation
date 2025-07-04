import express from 'express';
import { calculateQuote, requestQuote } from '../controllers/quoteController.js';

const router = express.Router();

// Quote calculation endpoint
router.get('/calculate-quote', calculateQuote);

// Quote request endpoint
router.post('/quote', requestQuote);

export default router;