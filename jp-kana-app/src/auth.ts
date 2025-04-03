import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import prisma from "./lib/prisma";
import { getEnvVar } from "./lib/env";

/**
 * Auth.js v5 configuration
 * Following best practices from the official documentation
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: getEnvVar("GITHUB_ID"),
      clientSecret: getEnvVar("GITHUB_SECRET"),
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login?error=auth",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = 
        request.nextUrl.pathname.startsWith('/hiragana') || 
        request.nextUrl.pathname.startsWith('/katakana') ||
        request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/settings');
      
      if (isProtectedRoute) {
        return isLoggedIn;
      }
      
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

// Export only the essential auth helpers
export { requireAuth, checkAuth } from './lib/auth';
