"use strict";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["tests", "src"],
  },
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
};

module.exports = nextConfig;
