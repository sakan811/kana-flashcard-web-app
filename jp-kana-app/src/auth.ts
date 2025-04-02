import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

// Import your auth options from the existing file
import { authOptions as existingAuthOptions } from "@/lib/auth-options";

// You can extend or modify the existing auth options if needed
export const authOptions: NextAuthConfig = {
  ...existingAuthOptions,
  callbacks: {
    ...existingAuthOptions.callbacks,
    authorized: async ({ auth, request }) => {
      // Return true if the user is logged in
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  }
};

// Export the NextAuth function with the auth options
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
