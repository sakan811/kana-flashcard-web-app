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
};

module.exports = nextConfig;
