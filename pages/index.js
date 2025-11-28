import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Fix: Use the correct URL format for direct access
      setShortUrl(`${window.location.origin}/${data.slug}`);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    try {
      const response = await fetch('/api/init-db');
      const data = await response.json();
      
      if (response.ok) {
        alert('Database initialized successfully! You can now shorten URLs.');
      } else {
        alert('Failed to initialize database: ' + data.error);
      }
    } catch (err) {
      alert('Error initializing database: ' + err.message);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Head>
        <title>URL Shortener</title>
        <meta name="description" content="Shorten your URLs quickly and easily" />
      </Head>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          URL Shortener
        </h1>
        
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">
            First time setup: Initialize database
          </p>
          <button
            onClick={initializeDatabase}
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Initialize Database
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL (e.g., https://example.com)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Error: {error}</p>
          </div>
        )}

        {shortUrl && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your shortened URL:</p>
            <div className="flex items-center space-x-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all font-medium flex-1"
              >
                {shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition duration-200"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click the link to test the redirect, or copy it to share!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}