// pages/api/shorten.js
import { query } from '../../lib/database';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  // This already only runs on server side (API routes are server-only)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validate URL
    new URL(url);

    let slug;
    let exists;
    let attempts = 0;
    
    do {
      slug = nanoid(6);
      const result = await query('SELECT slug FROM urls WHERE slug = $1', [slug]);
      exists = result.rows.length > 0;
      attempts++;
      
      if (attempts > 10) {
        return res.status(500).json({ error: 'Failed to generate unique slug' });
      }
    } while (exists);

    await query(
      'INSERT INTO urls (slug, original_url) VALUES ($1, $2)',
      [slug, url]
    );

    res.status(200).json({ 
      slug, 
      shortUrl: slug,
      originalUrl: url
    });
  } catch (error) {
    console.error('Shorten error:', error);
    
    if (error.message.includes('relation "urls" does not exist')) {
      return res.status(500).json({ 
        error: 'Database not ready. Please initialize the database first.' 
      });
    }
    
    if (error.code === '23505') {
      return handler(req, res);
    }
    
    res.status(400).json({ error: 'Invalid URL' });
  }
}