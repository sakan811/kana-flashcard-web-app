import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Edge-compatible Auth.js configuration
 * This is used in middleware and edge functions
 * It does NOT include the Prisma adapter which isn't edge-compatible
 */
export const { auth } = NextAuth(authConfig); 