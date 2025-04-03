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
  const missingVars: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Check required environment variables
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });

  // Check OAuth variables (required in production)
  if (isProduction) {
    oauthEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    });
  } else {
    // In development, just warn about missing OAuth variables
    const missingOAuthVars = oauthEnvVars.filter(envVar => !process.env[envVar]);
    if (missingOAuthVars.length > 0) {
      console.warn(`Warning: Missing OAuth environment variables in development: ${missingOAuthVars.join(', ')}`);
    }
  }

  // Check that at least one database URL is defined
  const hasDbConnection = dbEnvVars.some(envVar => !!process.env[envVar]);
  if (!hasDbConnection) {
    missingVars.push('Database connection (POSTGRES_PRISMA_URL or POSTGRES_URL_NON_POOLING)');
  }

  // Throw error if any required variables are missing
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Validate NEXTAUTH_SECRET has sufficient entropy
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn('Warning: NEXTAUTH_SECRET should be at least 32 characters long for security');
  }
}

/**
 * Get an environment variable with a fallback for development
 * @param key The environment variable name
 * @param defaultValue Optional default value
 * @returns The environment variable value or a placeholder in development
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  // In development mode, provide fallbacks for missing values
  if (!value && process.env.NODE_ENV !== 'production') {
    // For OAuth credentials in development, return placeholder values
    if (key === 'GITHUB_ID') return 'dev-github-id';
    if (key === 'GITHUB_SECRET') return 'dev-github-secret';
    
    console.warn(`Warning: Using placeholder for missing environment variable: ${key}`);
    return `placeholder-${key}`;
  }
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}