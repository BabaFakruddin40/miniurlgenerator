import pkg from 'pg';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

const { Pool } = pkg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@127.0.0.1:5432/url_shortener_db',
  connectionTimeoutMillis: 5000,
});

// Test connection immediately on server launch
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL Connection Failed:', err.message);
  } else {
    console.log('Connected to PostgreSQL Database at:', res.rows[0].now);
  }
});

db.on('error', (err) => {
  console.error('Unexpected PostgreSQL Error:', err.message);
});