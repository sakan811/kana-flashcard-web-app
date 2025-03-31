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
  "/api/user-progress"
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );

  // Check if this is a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(
    (route) => path.startsWith(route)
  );

  if (!isProtectedRoute && !isProtectedApiRoute) {
    return NextResponse.next();
  }

  // Get session token
  const token = await getToken({ req: request });

  // If there is no token and this is a protected route/API, handle accordingly
  if (!token) {
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*"
  ],
};
