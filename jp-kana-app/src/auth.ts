import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * Central export for all Auth.js functionality
 * This centralizes authentication configuration to ensure consistency
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

/**
 * Export convenience functions for authentication
 * These are reexports from lib/auth.ts to provide a unified API surface
 */
export {
  requireAuth,
  checkAuth,
  getUserById,
  getUserByEmail,
  getUserRole,
  hasRole,
  validateCsrfToken,
} from './lib/auth';

/**
 * This file acts as the main entry point for authentication in the application.
 * It centralizes all auth-related exports to make imports cleaner throughout the app.
 */
