"use strict";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["tests", "src"],
  },
  output: "standalone",
  outputFileTracingRoot:
    process.env.NODE_ENV === "production" ? "/vercel/vercel/path0" : undefined,
  distDir: ".next",
  // Optimize build output
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  experimental: {
    // Enable these experimental features to improve module resolution
    serverComponentsExternalPackages: [],
    optimizePackageImports: ['react', 'react-dom', 'next-auth'],
  },
};

module.exports = nextConfig;
