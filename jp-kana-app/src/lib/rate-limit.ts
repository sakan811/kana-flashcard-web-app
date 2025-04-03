import { NextRequest, NextResponse } from "next/server";

interface RateLimitState {
  timestamp: number;
  count: number;
}

// In-memory store for rate limiting
// Note: This is reset on server restart and doesn't work across multiple instances
// For production, use a distributed cache like Redis instead
const rateLimitStore = new Map<string, RateLimitState>();

/**
 * Basic rate limiter implementation for Edge Runtime
 * Uses in-memory store with IP-based rate limiting
 */
export function rateLimit(
  request: NextRequest,
  maxRequests: number,
  windowMs: number
): NextResponse | null {
  try {
    // Get IP from request (or use a fallback for local development)
    const ip = request.ip || '127.0.0.1';
    
    // Create a unique key for this IP + route combination
    const key = `${ip}:${request.nextUrl.pathname}`;
    
    // Get current timestamp
    const now = Date.now();
    
    // Get existing state for this IP, or create a new one
    const currentState = rateLimitStore.get(key) || {
      timestamp: now,
      count: 0
    };
    
    // Reset if outside of window
    if (now - currentState.timestamp > windowMs) {
      currentState.timestamp = now;
      currentState.count = 0;
    }
    
    // Increment count
    currentState.count++;
    
    // Update store
    rateLimitStore.set(key, currentState);
    
    // Check if over limit
    if (currentState.count > maxRequests) {
      // Return 429 Too Many Requests
      return NextResponse.json({
        success: false,
        error: "Rate limit exceeded. Please try again later."
      }, { 
        status: 429,
        headers: {
          'Retry-After': `${Math.ceil(windowMs / 1000)}`,
          'X-RateLimit-Limit': `${maxRequests}`,
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': `${Math.ceil((currentState.timestamp + windowMs) / 1000)}`
        }
      });
    }
    
    // Not rate limited
    return null;
  } catch (error) {
    // Log but don't block requests if rate limiting fails
    console.error('Rate limiting error:', error);
    return null;
  }
}