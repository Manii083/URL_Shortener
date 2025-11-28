// lib/database.js
import { Pool } from 'pg';

// Only create Pool if we're on the server side
let pool;

if (typeof window === 'undefined') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

export async function query(text, params) {
  // Only run on server side
  if (typeof window !== 'undefined') {
    throw new Error('Database queries can only be executed on the server side');
  }

  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initDB() {
  if (typeof window !== 'undefined') {
    throw new Error('Database initialization can only be done on the server side');
  }
  
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
}