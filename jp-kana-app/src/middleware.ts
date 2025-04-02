import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Protected API routes - these will require authentication
const protectedApiRoutes = [
  "/api/record-performance",
  "/api/kana-performance",
  "/api/random-kana", 
  "/api/kana-weights",
  "/api/update-progress",
  "/api/user-progress",
];

// Auth API routes that should always be allowed
const authApiRoutes = [
  "/api/auth/callback",
  "/api/auth/signin",
  "/api/auth/session",
  "/api/auth/csrf",
  "/api/auth/providers",
  "/api/auth/callback/github",
];

// Use the Auth.js v5 middleware pattern
export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  
  // Always allow NextAuth API routes without additional checks
  if (authApiRoutes.some(route => pathname.includes(route))) {
    return NextResponse.next();
  }

  // Check if this is a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Skip auth check for non-protected routes
  if (!isProtectedApiRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  const isAuthenticated = !!req.auth;
  
  // If authenticated, add the user ID to headers and allow the request
  if (isAuthenticated && req.auth?.user) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', req.auth.user.id);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // If not authenticated and it's a protected API route, return 401
  if (isProtectedApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Default: allow the request
  return NextResponse.next();
})

// Update the matcher to use the correct format
// The 'not' pattern needs to be in a different format than you had previously
export const config = {
  matcher: [
    // Include all API routes except auth routes
    "/api/record-performance/:path*",
    "/api/kana-performance/:path*",
    "/api/random-kana/:path*",
    "/api/kana-weights/:path*",
    "/api/update-progress/:path*",
    "/api/user-progress/:path*"
  ]
};
