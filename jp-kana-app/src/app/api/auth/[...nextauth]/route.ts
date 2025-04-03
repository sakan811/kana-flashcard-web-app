import { handlers } from "@/auth";

/**
 * Auth.js v5 API route
 * This exports the handlers directly from the auth.ts configuration
 */
export const { GET, POST } = handlers;

// Force dynamic rendering for auth routes
export const dynamic = "force-dynamic";

// Use Node.js runtime for compatibility with Prisma
export const runtime = "nodejs";
