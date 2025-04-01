// This file helps with module resolution in Vercel deployments
const path = require('path');
const fs = require('fs');

// Define common module paths used by Next.js
const modulePaths = [
  'next/dist/compiled/next-server/server.runtime.prod.js',
  'next/dist/server/next-server.js'
];

// Function to attempt module resolution through different paths
function resolveModule(modulePath) {
  try {
    return require(modulePath);
  } catch (error) {
    return null;
  }
}

// Export a function that will try to resolve common Next.js modules
function resolveNextModules() {
  const resolutions = {};
  
  modulePaths.forEach(modulePath => {
    const moduleKey = path.basename(modulePath, '.js');
    resolutions[moduleKey] = resolveModule(modulePath) || {};
  });
  
  return resolutions;
}

module.exports = resolveNextModules();