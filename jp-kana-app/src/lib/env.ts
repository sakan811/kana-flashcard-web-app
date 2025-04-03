/**
 * This module validates the presence and format of required environment variables.
 * It helps catch configuration errors early during startup rather than runtime.
 */

// Required environment variables for Auth.js
const requiredEnvVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

// OAuth provider environment variables (required for production)
const oauthEnvVars = [
  'GITHUB_ID',
  'GITHUB_SECRET',
] as const;

// Database-related environment variables (at least one needed)
const dbEnvVars = [
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING'
] as const;

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required variable is missing in production
 */
export function validateEnv(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const errors: string[] = [];

  // Always check core auth variables
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      errors.push(`Required environment variable ${key} is missing`);
    }
  }

  // Only strictly require OAuth variables in production
  if (isProd) {
    for (const key of oauthEnvVars) {
      if (!process.env[key]) {
        errors.push(`Required environment variable ${key} is missing in production`);
      }
    }
  }

  // Check if at least one database URL is provided
  const hasDbUrl = dbEnvVars.some(key => !!process.env[key]);
  if (!hasDbUrl) {
    errors.push(`At least one database connection URL is required: ${dbEnvVars.join(' or ')}`);
  }

  if (errors.length > 0) {
    if (isProd) {
      throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    } else {
      console.warn(`Environment validation warnings (safe to ignore in development):\n${errors.join('\n')}`);
    }
  }
}

/**
 * Get an environment variable with a fallback for development
 */
export const env = {
  GITHUB_ID: process.env.GITHUB_ID || '',
  GITHUB_SECRET: process.env.GITHUB_SECRET || '',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || (
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  ),
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret-do-not-use-in-production'
};