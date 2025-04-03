import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { authConfig } from "./auth.config";

/**
 * Complete Auth.js configuration with Prisma adapter
 * This is used in regular API routes and server components
 * but NOT in middleware or edge functions
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  events: {
    async signIn({ user }) {
      console.log("User signed in:", user.id);
    },
    async signOut() {
      console.log("User signed out");
    },
  },
  logger: {
    error(error) {
      console.error("Auth error:", error);
    },
  },
});

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
