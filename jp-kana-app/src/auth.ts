import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Create the auth helpers with a single configuration source
// This centralizes all authentication functionality from one export
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Export a convenience method for getting the current session user
// This ensures consistent typing across the application
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}
