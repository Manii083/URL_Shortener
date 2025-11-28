// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these on client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig