import { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";

// For process in server component
declare const process: {
  env: {
    NEXTAUTH_SECRET: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    NODE_ENV?: "development" | "production" | "test";
  };
};

// Extend session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // Explicitly specify the PKCE configuration
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
      }
      return token;
    },
    async session({ session, token }) {
      // Make sure session has user id
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Improved redirect handling for OAuth flows
      // Allow redirects to same-origin URLs
      if (url.startsWith("/")) {
        // For relative URLs like "/katakana", prepend the base URL
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        // Already absolute URL on same origin, allow as is
        return url;
      }
      // Default fallback to home page
      return baseUrl;
    },
    // Enhanced authorized callback for middleware protection
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedPage = !request.nextUrl?.pathname.startsWith('/login') && 
                               !request.nextUrl?.pathname.startsWith('/signup');
      
      if (process.env.NODE_ENV === "development") {
        console.log(`Authorization check for ${request.nextUrl?.pathname}: ${isLoggedIn ? 'authorized' : 'unauthorized'}`);
      }
      
      // For API routes, auth check is handled in middleware
      if (request.nextUrl?.pathname.startsWith('/api/')) {
        return true;
      }
      
      // For protected pages, require login
      return isOnProtectedPage ? isLoggedIn : true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax", 
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10 // 10 minutes in seconds
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
