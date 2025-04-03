import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { User } from "@/types/auth-types";
import prisma from "./prisma"; // Use the singleton prisma instance

/**
 * Strict authentication check for server components
 * Will redirect to login if not authenticated
 */
export const requireAuth = async (): Promise<User> => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user as User;
};

/**
 * Check authentication without redirecting
 * Useful when you need to conditionally render content
 */
export const checkAuth = async (): Promise<{
  isAuthenticated: boolean;
  user?: User;
}> => {
  const session = await auth();

  if (!session?.user) {
    return { isAuthenticated: false };
  }

  return {
    isAuthenticated: true,
    user: session.user as User,
  };
};
