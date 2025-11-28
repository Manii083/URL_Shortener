// pages/api/init-db.js
import { query } from '../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(10) UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_slug ON urls(slug);
    `);
    
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
}