import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for rate limiting
// Note: In production, you'd use Redis or another distributed cache
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * Implements a basic rate limiter for authentication endpoints
 * @param req The incoming request
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns NextResponse if rate limited, undefined if not limited
 */
export function rateLimit(
  req: NextRequest, 
  limit: number = 5, 
  windowMs: number = 60 * 1000
): NextResponse | undefined {
  // Get client IP or fallback
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  
  // Get or initialize data for this IP
  const ipData = ipRequestCounts.get(ip) || { count: 0, resetTime: now + windowMs };
  
  // Check if window has passed and we should reset
  if (now > ipData.resetTime) {
    ipData.count = 1;
    ipData.resetTime = now + windowMs;
  } else {
    ipData.count++;
  }
  
  // Update the map
  ipRequestCounts.set(ip, ipData);
  
  // Calculate remaining attempts and reset time
  const remaining = Math.max(0, limit - ipData.count);
  const reset = Math.ceil((ipData.resetTime - now) / 1000);
  
  // Set rate limiting headers
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", limit.toString());
  headers.set("X-RateLimit-Remaining", remaining.toString());
  headers.set("X-RateLimit-Reset", reset.toString());
  
  // Return error response if limit exceeded
  if (ipData.count > limit) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        message: `Rate limit exceeded. Try again in ${reset} seconds.`
      }), 
      { 
        status: 429, 
        headers 
      }
    );
  }
  
  return undefined;
}

// Clean up expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}, 60 * 1000); // Run cleanup every minute