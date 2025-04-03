import { NextResponse } from "next/server";
import { auth } from "@/auth.edge";
import { AUTH_ROUTES, AUTH_HEADERS } from "@/lib/auth-constants";

/**
 * Auth.js v5 middleware for route protection
 * Edge Runtime compatible
 */
export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  
  // Skip middleware for authentication API routes and static files
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('favicon.ico')
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
    // Important: For API routes, add the user ID to headers so API handlers can access it
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
  
  if (isProtectedPageRoute) {
    // Create a safe URL for the login page
    const encodedFrom = encodeURIComponent(pathname);
    const redirectUrl = `/login?callbackUrl=${encodedFrom}`;
    
    return NextResponse.redirect(new URL(redirectUrl, nextUrl.origin));
  }
  
  return NextResponse.next();
});

/**
 * Define which routes this middleware should run on
 * Explicitly exclude auth routes to avoid conflicts
 */
export const config = {
  matcher: [
    // Include protected routes
    '/api/record-performance/:path*',
    '/api/kana-performance/:path*',
    '/api/random-kana/:path*',
    '/api/kana-weights/:path*',
    '/api/update-progress/:path*',
    '/api/user-progress/:path*',
    '/hiragana/:path*', 
    '/katakana/:path*',
    '/login',
    
    // Exclude auth API routes and static files
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ]
};
