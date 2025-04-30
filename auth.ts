import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    // Use JWT for better session management
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
          user = await prisma.user.findUnique({
            where: { email: username },
            select: { id: true, name: true, email: true, password: true },
          });
        } catch (error) {
          console.error("Database error:", error);
          throw new Error("Database error: " + (error instanceof Error ? error.message : "Unknown error"));
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
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account, user }) {
      // Pass any error information to the token
      if (account?.error) {
        token.error = account.error;
      }
      return token;
    },
  },
});
