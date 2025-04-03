/**
 * Comprehensive type definitions for authentication
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

// Type for GitHub OAuth provider profile
export interface GithubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

// Auth token type
export interface AuthToken {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
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

// Type for JWT callback parameters
export interface JWTCallbackParams {
  token: AuthToken;
  user?: User;
  account?: any;
  profile?: GithubProfile;
  isNewUser?: boolean;
}