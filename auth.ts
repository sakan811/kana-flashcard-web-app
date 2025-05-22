import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user if they don't exist
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split("@")[0],
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user && account) {
        token.sub = user.id;
        token.signInTimestamp = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.sub);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login/error",
  },
});

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
}