import { NextResponse } from 'next/server';
import { auth } from "./auth";

export default auth((req) => {
  // For API routes, add the user ID to headers
  if (req.auth?.user?.id && req.nextUrl.pathname.startsWith('/api') && 
      !req.nextUrl.pathname.startsWith('/api/auth')) {
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
