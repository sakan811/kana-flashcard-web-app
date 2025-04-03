import { NextResponse } from "next/server";
import { auth } from "@/auth.edge";
import { AUTH_ROUTES, AUTH_HEADERS } from "@/lib/auth-constants";

/**
 * Auth.js v5 middleware for route protection
 * Edge Runtime compatible with reduced complexity
 */
export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  
  // Skip middleware for authentication API routes, static files and public routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('favicon.ico') ||
    pathname === '/' ||
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  // Only protect specific routes
  const isProtectedApiRoute = AUTH_ROUTES.PROTECTED_API_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  const isProtectedPageRoute = AUTH_ROUTES.PROTECTED_PAGE_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Allow access to non-protected routes without checking auth
  if (!isProtectedApiRoute && !isProtectedPageRoute) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (req.auth?.user) {
    // For API routes, add the user ID to headers so API handlers can access it
    if (isProtectedApiRoute) {
      const headers = new Headers(req.headers);
      headers.set(AUTH_HEADERS.USER_ID, req.auth.user.id);
      return NextResponse.next({
        request: {
          headers
        }
      });
    }
    return NextResponse.next();
  }

  // Handle unauthenticated requests
  if (isProtectedApiRoute) {
    return NextResponse.json({ 
      success: false, 
      error: "Unauthorized: Authentication required" 
    }, { status: 401 });
  }
  
  // Redirect to login page with callback URL for protected pages
  const encodedFrom = encodeURIComponent(pathname);
  const redirectUrl = `/login?callbackUrl=${encodedFrom}`;
  
  return NextResponse.redirect(new URL(redirectUrl, nextUrl.origin));
});

/**
 * Define which routes this middleware should run on
 */
export const config = {
  matcher: [
    // Match all paths except those that:
    // - Start with /api/auth
    // - Start with /_next/static
    // - Start with /_next/image
    // - Are favicon.ico
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    // Protected routes
    '/hiragana/:path*',
    '/katakana/:path*',
    '/profile/:path*',
    '/settings/:path*',
    // API routes
    '/api/:path*',
  ]
};
