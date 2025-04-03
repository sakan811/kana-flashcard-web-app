import { NextResponse } from 'next/server';
import { auth } from "./auth";

export default auth((req) => {
  // Add user ID to headers for API routes
  if (req.auth?.user?.id && req.nextUrl.pathname.startsWith('/api')) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', req.auth.user.id);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
});

// Specify which routes should be processed by the middleware
export const config = {
  matcher: [
    // Protected routes
    '/hiragana/:path*',
    '/katakana/:path*',
    '/profile/:path*',
    '/settings/:path*',
    // API routes
    '/api/:path*',
  ],
};
