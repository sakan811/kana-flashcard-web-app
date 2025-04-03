/**
 * Simplified type definitions for authentication
 * Follows NextAuth v5 standards
 */
import { DefaultSession } from "next-auth";

// Define user roles for the application
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Extending the built-in User type from next-auth
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extending the built-in Session type from next-auth
export interface Session extends DefaultSession {
  user?: User;
  expires: string;
}

// Auth token type for JWT session
export interface AuthToken {
  name?: string;
  email?: string;
  picture?: string;
  id?: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
  jti?: string;
}

// Type for authentication errors
export interface AuthError {
  type: string;
  message: string;
}