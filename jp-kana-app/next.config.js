"use strict";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["tests", "src"],
  },
  output: "standalone",
  outputFileTracingRoot: process.cwd(), // Dynamically set correct root
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
};

module.exports = nextConfig;
