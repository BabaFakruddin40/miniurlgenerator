import { db } from '../config/db.js';
import { redis } from '../config/redis.js';

// 1. Handle HTTP 302 Redirection
export const redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    // Step A: Check Redis Cache first
    const cachedUrl = await redis.get(`url:${code}`);
    if (cachedUrl) {
      db.query('UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1', [code]);
      return res.redirect(302, cachedUrl);
    }

    // Step B: Cache miss - Query PostgreSQL
    const result = await db.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Short URL not found');
    }

    const originalUrl = result.rows[0].original_url;

    // Step C: Cache in Redis (TTL: 24 Hours)
    await redis.set(`url:${code}`, originalUrl, 'EX', 86400);

    // Asynchronously update click count
    db.query('UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1', [code]);

    return res.redirect(302, originalUrl);
  } catch (err) {
    console.error('Redirect Error:', err);
    return res.status(500).send('Server Error');
  }
};

// 2. Handle URL Shortening
export const createShortener = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Check existing record
    const existing = await db.query(
      'SELECT short_code, original_url, clicks FROM urls WHERE original_url = $1',
      [originalUrl]
    );

    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      return res.json({
        shortCode: row.short_code,
        shortUrl: `${process.env.BASE_URL}/s/${row.short_code}`,
        originalUrl: row.original_url,
        clicks: parseInt(row.clicks, 10),
      });
    }

    // Insert new URL and generate Base62 code
    const insertResult = await db.query(
      `INSERT INTO urls (original_url) 
       VALUES ($1) 
       RETURNING id`,
      [originalUrl]
    );

    const newId = insertResult.rows[0].id;

    const updateResult = await db.query(
      `UPDATE urls 
       SET short_code = encode_base62(id + 100000) 
       WHERE id = $1 
       RETURNING short_code, original_url, clicks`,
      [newId]
    );

    const row = updateResult.rows[0];
    const shortUrl = `${process.env.BASE_URL}/s/${row.short_code}`;

    // Populate Redis cache immediately
    await redis.set(`url:${row.short_code}`, row.original_url, 'EX', 86400);

    return res.status(201).json({
      shortCode: row.short_code,
      shortUrl,
      originalUrl: row.original_url,
      clicks: 0,
    });
  } catch (err) {
    console.error('Shorten Error:', err);
    return res.status(500).json({ error: 'Failed to generate short URL' });
  }
};

// 3. Handle Fetching Recent History
export const getHistory = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, short_code, original_url, clicks, created_at FROM urls ORDER BY id DESC LIMIT 20'
    );

    const links = result.rows.map((row) => ({
      id: row.id,
      code: row.short_code,
      original: row.original_url,
      short: `${process.env.BASE_URL}/s/${row.short_code}`,
      clicks: parseInt(row.clicks, 10),
      createdAt: row.created_at,
    }));

    return res.json(links);
  } catch (err) {
    console.error('History Fetch Error:', err);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
};