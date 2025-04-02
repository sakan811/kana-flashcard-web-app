import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export type User = {
  id: string;
  email: string;
  name: string | null;
};

// Function to get a user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

// Function to require authentication in server components
export const requireAuth = async (): Promise<User> => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user as User;
};

// Function to check auth status without redirecting
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
