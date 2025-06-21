/*
 * SakuMari - Japanese Kana Flashcard App
 * Copyright (C) 2025  Sakan Nirattisaykul
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

// Google OAuth provider
const googleProvider = Google({
  clientId: process.env.AUTH_GOOGLE_ID!,
  clientSecret: process.env.AUTH_GOOGLE_SECRET!,
});

// Test credentials provider for development and testing
const testCredentialsProvider = Credentials({
  id: "test-credentials",
  name: "Test User",
  credentials: {
    password: { label: "Password", type: "password" },
  },
  authorize: (credentials) => {
    if (credentials?.password === "test123") {
      return {
        id: "test-user-e2e",
        email: "test@sakumari.local",
        name: "Test User",
        image: null,
      };
    }
    return null;
  },
});

// Determine which providers to use based on environment
const getProviders = () => {
  const providers = [];
  
  // Always include Google in production
  if (process.env.NODE_ENV === "production") {
    providers.push(googleProvider);
  } else {
    // In development/test, include both Google and test credentials
    if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
      providers.push(googleProvider);
    }
    providers.push(testCredentialsProvider);
  }
  
  return providers;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: getProviders(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
      },
    }),
  },
  pages: {
    signIn: '/api/auth/signin',
  },
});