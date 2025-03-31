"use strict";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["tests", "src"],
  },
  typescript: {
    dirs: ["tests", "src"],
  },
  output: "standalone",
};

module.exports = nextConfig;
