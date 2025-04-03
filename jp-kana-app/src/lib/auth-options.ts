import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { authConfig } from "../auth.config";
import { validateEnv } from "./env";

// Validate environment variables on module load
try {
  validateEnv();
} catch (error) {
  console.error("Auth.js initialization error:", error);
  // Continue in development but with warnings
  if (process.env.NODE_ENV === 'production') {
    throw error; // Re-throw in production to prevent insecure configuration
  }
}

/**
 * Auth.js configuration that includes the Prisma adapter and events
 * This is used for server-side components and API routes
 */
export const authOptions = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.id}`);
    },
  },
};
