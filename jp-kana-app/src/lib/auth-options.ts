import { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { getEnvVar, validateEnv } from "./env";
import { User } from "@/types/auth-types";

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

// Extend session types with more explicit definitions
declare module "next-auth" {
  interface Session {
    user: User;
  }
}

/**
 * Auth.js configuration options
 * Centralized configuration for consistent authentication behavior
 */
export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: getEnvVar('GITHUB_ID'),
      clientSecret: getEnvVar('GITHUB_SECRET'),
      // Use PKCE (Proof Key for Code Exchange) for improved security
      authorization: { 
        params: { 
          scope: "read:user user:email"
        } 
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in - include user id in token
      if (user) {
        token.id = user.id;
        
        // If the user has a role, include it in the token
        if ('role' in user && user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Make sure session has user id and other key information
      if (session.user) {
        session.user.id = token.id as string;
        if (token.role) {
          session.user.role = token.role as string;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Improved redirect handling for OAuth flows
      if (url.startsWith("/")) {
        // For relative URLs, prepend the base URL
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        // Already absolute URL on same origin, allow as is
        return url;
      }
      // Default fallback to home page
      return baseUrl;
    },
    // Simplified authorized callback
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
  events: {
    async signIn({ user }) {
      // Log successful sign-ins for security monitoring
      console.log(`User signed in: ${user.id}`);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    // Improve cookie configuration for better cross-domain compatibility
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: getEnvVar('NEXTAUTH_SECRET'),
  debug: process.env.NODE_ENV === "development",
  // Security options
  useSecureCookies: process.env.NODE_ENV === "production",
  trustHost: true,
};
