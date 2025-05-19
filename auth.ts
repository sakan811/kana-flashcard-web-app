import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Define the NextAuth configuration
const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // Updating this to check the database on each request
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
          throw new Error("Please enter your username and password");
        }

        const username = String(credentials.username).trim();
        const password = String(credentials.password).trim();

        if (!username || !password) {
          throw new Error("Username and password cannot be empty");
        }

        let user;
        try {
          // Find user and make sure it exists and is active
          user = await prisma.user.findUnique({
            where: {
              email: username,
              // Add an active flag if you want to support "soft deletes"
              // active: true,
            },
            select: { id: true, name: true, email: true, password: true },
          });
        } catch (error) {
          console.error("Database error:", error);
          throw new Error(
            "Database error: " +
              (error instanceof Error ? error.message : "Unknown error"),
          );
        }

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
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
      // Only allow sign in if user object is valid
      return !!user && !!user.email;
    },
    async session({ session, token }) {
      // Add user ID to session from token
      if (token && session.user) {
        // Ensure sub is treated as string
        if (token.sub) {
          session.user.id = String(token.sub);

          // Add an additional check here to verify the user still exists in the database
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: String(token.sub) },
              select: { id: true },
            });

            if (!dbUser) {
              // User no longer exists in the database
              return null as any; // This will force a session end
            }
          } catch (error) {
            console.error("Session verification error:", error);
            // Continue with the session if DB check fails to prevent locking users out
          }
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
      // Pass any error information to the token
      if (account?.error) {
        token.error = account.error;
      }

      // Add the signin timestamp to enable checking for session validity
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
    async signOut(message) {
      if (message.session?.user?.email) {
        console.log(`User signed out: ${message.session.user.email}`);
      }
    },
    // The session event is not used in this implementation
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
