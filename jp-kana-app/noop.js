// This file helps fix Vercel deployment issues with missing modules
try {
  // First, try direct require
  module.exports = require('next/dist/compiled/next-server/server.runtime.prod');
} catch (error) {
  try {
    // If direct require fails, try our custom module resolver
    module.exports = require('./module-resolver');
  } catch (resolverError) {
    // Final fallback - empty object
    module.exports = {};
  }
}
