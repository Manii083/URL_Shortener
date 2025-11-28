// pages/[slug].js
import { query } from '../lib/database';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// This runs on the server side
export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    // Get the original URL from database
    const result = await query(
      'SELECT original_url FROM urls WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return {
        props: {
          error: 'URL not found',
          slug
        }
      };
    }

    // Update click count
    await query(
      'UPDATE urls SET clicks = clicks + 1 WHERE slug = $1',
      [slug]
    );

    // Return the original URL for redirect
    return {
      props: {
        originalUrl: result.rows[0].original_url,
        slug
      }
    };
  } catch (error) {
    console.error('Redirect error:', error);
    return {
      props: {
        error: 'Failed to redirect',
        slug
      }
    };
  }
}

export default function RedirectPage({ originalUrl, error, slug }) {
  const router = useRouter();

  useEffect(() => {
    if (originalUrl) {
      // Client-side redirect
      window.location.href = originalUrl;
    }
  }, [originalUrl]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Head>
          <title>Error - URL Not Found</title>
        </Head>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">URL Not Found</h1>
          <p className="text-gray-600 mb-4">The shortened URL <code className="bg-gray-100 px-2 py-1 rounded">/{slug}</code> does not exist.</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Shorten New URL
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Head>
        <title>Redirecting...</title>
      </Head>
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your destination...</p>
        <p className="text-sm text-gray-500 mt-2">If you are not redirected automatically, <a href={originalUrl} className="text-blue-600 hover:underline">click here</a>.</p>
      </div>
    </div>
  );
}