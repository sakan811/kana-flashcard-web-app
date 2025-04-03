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
      // Simple logging, no need for console.log
    },
    async signOut() {
      // Simple logging, no need for console.log
    },
  },
});

// Export only the essential auth helpers from lib/auth
export {
  requireAuth,
  checkAuth,
} from './lib/auth';
