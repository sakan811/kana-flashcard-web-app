import { NextResponse } from "next/server";
import { auth } from "@/auth.edge";

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

  // Protected API paths
  const protectedApiPaths = [
    '/api/record-performance',
    '/api/kana-performance',
    '/api/random-kana',
    '/api/kana-weights',
    '/api/update-progress',
    '/api/user-progress',
  ];
  
  // Protected page paths
  const protectedPagePaths = [
    '/hiragana',
    '/katakana',
  ];

  // Only protect specific routes
  const isProtectedApiRoute = protectedApiPaths.some(route => 
    pathname.startsWith(route)
  );
  
  const isProtectedPageRoute = protectedPagePaths.some(route => 
    pathname.startsWith(route)
  );

  // Allow access to non-protected routes without checking auth
  if (!isProtectedApiRoute && !isProtectedPageRoute) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (req.auth?.user) {
    return NextResponse.next();
  }

  // Handle unauthenticated requests
  if (isProtectedApiRoute) {
    return NextResponse.json({ 
      success: false, 
      error: "Unauthorized" 
    }, { status: 401 });
  }
  
  if (isProtectedPageRoute) {
    return NextResponse.redirect(
      new URL(`/login`, req.url)
    );
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
    
    // Exclude auth routes
    '/((?!api/auth|_next/static|_next/image).*)',
  ]
};
