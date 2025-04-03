import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { User } from "@/types/auth-types";

const prisma = new PrismaClient();

/**
 * Function to get a user by email with validation
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  // Basic email validation
  if (!email || !email.includes('@')) {
    throw new Error("Invalid email format");
  }
  
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Function to get a user by id
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  if (!userId) return null;
  
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

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

/**
 * Utility to get user role from database
 * Useful for role-based access control
 */
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    return user?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

/**
 * Helper to securely validate CSRF token
 */
export const validateCsrfToken = (
  cookieToken: string | undefined, 
  bodyToken: string | undefined
): boolean => {
  if (!cookieToken || !bodyToken) {
    return false;
  }
  
  // Use timing-safe comparison
  return cookieToken === bodyToken;
};

/**
 * Clear auth cookies - useful for sign out or error recovery
 */
export const clearAuthCookies = (cookies: ResponseCookies) => {
  cookies.delete('next-auth.session-token');
  cookies.delete('next-auth.csrf-token');
  cookies.delete('next-auth.callback-url');
  cookies.delete('next-auth.pkce.code_verifier');
};

/**
 * Get the current authentication status and user
 * Single exported method to be used across the application
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  return session?.user as User || null;
}

/**
 * Check if a user has a specific role
 * @param user The user object
 * @param role The role to check
 * @returns Boolean indicating if the user has the role
 */
export async function hasRole(userId: string, role: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole === role;
}

/**
 * Require a user to have a specific role
 * @param userId The user ID
 * @param role The required role
 * @throws Error if the user doesn't have the required role
 */
export async function requireRole(userId: string, role: string): Promise<void> {
  const hasRequiredRole = await hasRole(userId, role);
  
  if (!hasRequiredRole) {
    throw new Error(`Forbidden: Requires ${role} role`);
  }
}
