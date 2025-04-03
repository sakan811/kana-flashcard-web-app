import { NextRequest, NextResponse } from "next/server";

interface RateLimitState {
  timestamp: number;
  count: number;
}

// In-memory store for rate limiting
// Note: This is reset on server restart and doesn't work across multiple instances
// For production, use a distributed cache like Redis instead
const rateLimitStore = new Map<string, RateLimitState>();