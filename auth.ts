import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

// Optimized Auth.js configuration following best practices
const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours (not on every request)
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please enter both username and password");
        }

        const username = String(credentials.username).trim();
        const password = String(credentials.password).trim();

        if (!username || !password) {
          throw new Error("Username and password cannot be empty");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: username },
            select: { id: true, name: true, email: true, password: true },
          });

          if (!user || !user.password) {
            throw new Error("Account not found. Please check your username or sign up.");
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("Incorrect password. Please try again.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw error; // Re-throw application errors
          }
          console.error("Database error:", error);
          throw new Error("Unable to connect to database. Please try again later.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.sub = user.id;
        token.signInTimestamp = Date.now();
      }

      // Update trigger (for session refresh)
      if (trigger === "update") {
        // Re-fetch user data if needed
        token.lastUpdated = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client (only available when using JWT strategy)
      if (token && session.user) {
        session.user.id = String(token.sub);
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      console.log(`User signed in: ${user.email}${isNewUser ? ' (new user)' : ''}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email || 'unknown'}`);
    },
  },
  pages: {
    signIn: "/login/signin",
    error: "/login/error",
  },
  experimental: {
    enableWebAuthn: false, // Set to true if using WebAuthn
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

// Type declarations
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface JWT {
    signInTimestamp?: number;
    lastUpdated?: number;
  }
}