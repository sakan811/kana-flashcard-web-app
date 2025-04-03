/**
 * This module validates the presence and format of required environment variables.
 * It helps catch configuration errors early during startup rather than runtime.
 */

// Required environment variables for Auth.js
const requiredEnvVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
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
 * @throws {Error} If any required variable is missing
 */
export function validateEnv(): void {
  const missingVars: string[] = [];
  
  // Check required environment variables
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });

  // Check that at least one database URL is defined
  const hasDbConnection = dbEnvVars.some(envVar => !!process.env[envVar]);
  if (!hasDbConnection) {
    missingVars.push('Database connection (POSTGRES_PRISMA_URL or POSTGRES_URL_NON_POOLING)');
  }

  // Throw error if any variables are missing
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Validate NEXTAUTH_SECRET has sufficient entropy
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn('Warning: NEXTAUTH_SECRET should be at least 32 characters long for security');
  }
}

/**
 * Get a required environment variable
 * @param key The environment variable name
 * @param defaultValue Optional default value
 * @returns The environment variable value
 * @throws {Error} If the variable is not defined and no default is provided
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}