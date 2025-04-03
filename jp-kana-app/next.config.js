"use strict";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["tests", "src"],
  },
  // Use 'standalone' for production builds only to avoid development issues
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  // Remove outputFileTracingRoot as it can cause path resolution issues
  distDir: ".next",
  // Optimize build output
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  // Add image domains configuration for GitHub avatars
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  // Ensure API routes work correctly
  async rewrites() {
    return [
      // Auth API routes
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      // API routes
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // Pages fallback
      {
        source: '/:path*',
        destination: '/:path*',
      }
    ];
  },
  // Add security headers for authentication best practices
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
