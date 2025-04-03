import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "./lib/rate-limit";
import { AUTH_ROUTES, AUTH_HEADERS, SESSION_CONFIG, AUTH_PATHS } from "./lib/auth-constants";

/**
 * Auth.js v5 middleware for route protection
 * Handles authentication, authorization and rate limiting
 */
export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  
  // 1. Apply rate limiting to sensitive endpoints
  if (AUTH_ROUTES.RATE_LIMITED_ROUTES.some(route => pathname.includes(route))) {
    const rateLimited = rateLimit(req, SESSION_CONFIG.RATE_LIMIT_MAX, SESSION_CONFIG.RATE_LIMIT_WINDOW);
    if (rateLimited) return rateLimited;
  }
  
  // 2. Always allow Auth.js API routes without authentication checks
  if (AUTH_ROUTES.AUTH_API_ROUTES.some(route => pathname.includes(route))) {
    return NextResponse.next();
  }

  // 3. Check if the current route needs protection
  const isProtectedApiRoute = AUTH_ROUTES.PROTECTED_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  const isProtectedPageRoute = AUTH_ROUTES.PROTECTED_PAGE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 4. Skip auth check for non-protected routes
  if (!isProtectedApiRoute && !isProtectedPageRoute) {
    return NextResponse.next();
  }

  // 5. For protected routes, validate authentication
  const isAuthenticated = !!req.auth;
  
  // 6. If authenticated, add user ID to headers and proceed
  if (isAuthenticated && req.auth?.user && req.auth.user.id) {
    // Create a new response object with the userId header
    const response = NextResponse.next();
    // Set the header on the response (Edge-compatible way)
    response.headers.set(AUTH_HEADERS.USER_ID, String(req.auth.user.id));
    return response;
  }

  // 7. Handle unauthenticated requests
  // For API routes: return 401 Unauthorized
  if (isProtectedApiRoute) {
    return NextResponse.json({ 
      success: false, 
      error: "Unauthorized: Authentication required" 
    }, { status: 401 });
  }
  
  // For page routes: redirect to login with callback URL
  if (isProtectedPageRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`${AUTH_PATHS.SIGN_IN}?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // 8. Default fallback: allow the request
  return NextResponse.next();
});

/**
 * Define which routes this middleware should run on
 * Using specific matchers improves performance
 */
export const config = {
  matcher: [
    // Protected API routes
    '/api/record-performance/:path*',
    '/api/kana-performance/:path*',
    '/api/random-kana/:path*',
    '/api/kana-weights/:path*',
    '/api/update-progress/:path*',
    '/api/user-progress/:path*',
    
    // Auth API routes (pass through)
    '/api/auth/:path*',
    
    // Protected pages
    '/hiragana/:path*', 
    '/katakana/:path*',
    
    // Also match login page for rate limiting
    '/login'
  ]
};
