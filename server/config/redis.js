import Redis from 'ioredis';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

export const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('Connected to Redis Cache');
});

redis.on('error', (err) => {
  console.error('Redis Connection Error:', err.message);
});