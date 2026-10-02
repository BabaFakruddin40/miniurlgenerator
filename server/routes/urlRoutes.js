import express from 'express';
import {
  redirectUrl,
  createShortener,
  getHistory,
} from '../controllers/urlController.js';

const router = express.Router();

// Redirection route
router.get('/s/:code', redirectUrl);

// API endpoints
router.post('/api/shorten', createShortener);
router.get('/api/history', getHistory);

export default router;