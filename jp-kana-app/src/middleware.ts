import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected routes that require authentication
const protectedRoutes = ["/hiragana", "/katakana", "/reference"];

// Protected API routes
const protectedApiRoutes = [
  "/api/record-performance",
  "/api/kana-performance",
  "/api/random-kana",
  "/api/kana-weights",
  "/api/update-progress",
  "/api/user-progress",
];

// Public routes that should never redirect even when unauthenticated
const publicRoutes = [
  "/login",
  "/signup",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/static",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes without authentication check
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Check if this is a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtectedRoute && !isProtectedApiRoute) {
    return NextResponse.next();
  }

  try {
    // Use JWT token check to avoid Prisma in Edge Runtime
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    // If authenticated, allow access
    if (token) {
      return NextResponse.next();
    }

    // If not authenticated and it's an API route, return 401
    if (isProtectedApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If not authenticated and it's a page route, redirect to login
    // with the original URL as the callbackUrl
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Authentication error:", error);
    
    // In case of error, allow access to protected routes in development
    if (process.env.NODE_ENV === "development") {
      console.warn("Authentication error in development - allowing access for debugging");
      return NextResponse.next();
    }
    
    if (isProtectedApiRoute) {
      return NextResponse.json({ error: "Auth Error" }, { status: 500 });
    }

    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }
}

// Update the matcher to match only the paths we need to check
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
};
