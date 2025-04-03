import { NextResponse } from "next/server";

/**
 * Test endpoint to verify API functionality
 * This helps diagnose if there are general issues with API routes
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API route is working correctly",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}

export const dynamic = "force-dynamic"; 