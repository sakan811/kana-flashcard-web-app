import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Define types for JSON values
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

// Define the NextAuth configuration
const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 0, // Force session check on each request
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

        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: username,
            },
            select: { id: true, name: true, email: true, password: true },
          });
        } catch (error) {
          console.error("Database error:", error);
          throw new Error("Unable to connect to database. Please try again later.");
        }

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
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user && !!user.email;
    },
    async session({ session, token }) {
      if (token && session.user && token.sub) {
        session.user.id = String(token.sub);
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account?.error) {
        token.error = String(account.error);
      }

      if (user) {
        token.signInTimestamp = Date.now();
      }

      return token;
    },
  },
  events: {
    async signIn(message) {
      if (message.user.email) {
        console.log(`User signed in: ${message.user.email}`);
      }
    },
    async signOut(message: any) {
      try {
        const email =
          message?.user?.email ||
          message?.session?.user?.email ||
          message?.token?.email;

        if (email) {
          console.log(`User signed out: ${email}`);
        } else {
          console.log("User signed out (no email available)");
        }
      } catch (error) {
        console.log("User signed out (no email available)");
      }
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

// Add type declarations for JWT token
declare module "next-auth/jwt" {
  interface JWT {
    sub?: string | number;
    error?: string;
    signInTimestamp?: number;
  }
}

// Add type declarations for Session
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
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
}