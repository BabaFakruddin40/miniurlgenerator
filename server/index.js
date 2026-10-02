import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'node:process';
import urlRoutes from './routes/urlRoutes.js';
import { db } from './config/db.js';
import { redis } from './config/redis.js';

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.get('/health', async (_req, res) => {
  try {
    await Promise.all([db.query('SELECT 1 FROM urls LIMIT 1'), redis.ping()]);
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});

// Register Routes
app.use('/', urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing on port ${PORT}`);
});