import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import prisma from "./lib/prisma";

/**
 * Auth.js v5 configuration
 * Updated to ensure proper session handling
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
        request.nextUrl.pathname.startsWith('/settings') ||
        (request.nextUrl.pathname.startsWith('/api') && 
         !request.nextUrl.pathname.startsWith('/api/auth'));
      
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
  debug: process.env.NODE_ENV === 'development',
});

// Export only the essential auth helpers
export { requireAuth, checkAuth } from './lib/auth';
