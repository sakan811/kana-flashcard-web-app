import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import { getEnvVar } from "./lib/env";
import { UserRole } from "./types/auth-types";

/**
 * Auth.js configuration that is safe to use in Edge Runtime
 * This configuration is used in middleware and does NOT include adapters
 */
export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: getEnvVar('GITHUB_ID'),
      clientSecret: getEnvVar('GITHUB_SECRET'),
      authorization: { 
        params: { 
          scope: "read:user user:email"
        } 
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if ('role' in user && user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.role) {
          session.user.role = token.role as UserRole;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    // Always use JWT for Edge compatibility
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
}; 