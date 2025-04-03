import { NextResponse } from "next/server";

/**
 * Debug API route to check auth-related headers and cookies
 * This helps identify issues with session handling
 */
export async function GET(request: Request) {
  const headers = Object.fromEntries(request.headers.entries());
  
  // Get cookies from request
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  // Filter out sensitive information
  const safeHeaders = { ...headers };
  delete safeHeaders.authorization;
  delete safeHeaders.cookie;
  
  // Check for session token cookie
  const hasSessionToken = Object.keys(cookies).some(key => 
    key.includes('next-auth.session-token')
  );
  
  return NextResponse.json({
    debug: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    authEndpoint: "/api/auth/session",
    hasSessionCookie: hasSessionToken,
    cookieKeys: Object.keys(cookies),
    headerKeys: Object.keys(headers),
    requestUrl: request.url,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  });
}

export const dynamic = "force-dynamic"; 