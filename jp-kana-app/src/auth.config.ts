import { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { env } from "@/lib/env";

const SESSION_STRATEGY = "jwt";

/**
 * Auth.js v5 config without the adapter - for edge compatibility
 * Used in middleware and auth.edge.ts
 */
export const authConfig: NextAuthConfig = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ token, request }) {
      const isLoggedIn = !!token?.id;
      const isOnDashboard = (
        request.nextUrl.pathname.startsWith('/hiragana') || 
        request.nextUrl.pathname.startsWith('/katakana')
      );
      
      // If we're on a dashboard route, we need to be logged in
      if (isOnDashboard) {
        return isLoggedIn; // Allow access only if logged in
      }
      
      return true; // Allow access to non-dashboard routes
    },
    jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      } else if (token) {
        session.user = { id: token.id as string };
      }
      return session;
    }
  },
  session: {
    strategy: SESSION_STRATEGY,
  },
  // Enables trusting the host for production environments or when behind a trusted proxy.
  // This is necessary for proper callback URL handling in some deployment setups.
  trustHost: true,
};