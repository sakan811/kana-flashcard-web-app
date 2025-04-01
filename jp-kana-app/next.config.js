"use strict";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["tests", "src"],
  },
  output: "standalone",
  outputFileTracingRoot:
    process.env.NODE_ENV === "development" ? "/app" : undefined,
  distDir: ".next",
  // Optimize build output
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
};

module.exports = nextConfig;
