import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export type User = {
  id: string;
  email: string;
  name: string | null;
};

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Function to compare a password with a hash
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Function to create a new user
export const createUser = async (
  email: string,
  password: string,
  name?: string,
): Promise<User | null> => {
  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// Function to get a user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

// Function to check if user is authenticated, redirect if not
export const requireAuth = async (): Promise<User> => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user as User;
};

// Function to check if user is authenticated, return status
export const checkAuth = async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
  const session = await auth();

  if (!session?.user) {
    return { isAuthenticated: false };
  }

  return {
    isAuthenticated: true,
    user: session.user as User,
  };
};
