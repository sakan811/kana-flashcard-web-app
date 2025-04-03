import { NextRequest, NextResponse } from "next/server";

/**
 * Type definition for the handler function to be wrapped with authentication
 */
export type ApiHandler = (
  request: NextRequest,
  userId: string
) => Promise<NextResponse>;

/**
 * Standard API response formats
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data });
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

/**
 * Middleware to handle API authentication
 */
export function withAuth(handler: ApiHandler) {
  return async (request: NextRequest) => {
    try {
      // Get the user ID from the request headers (set by middleware)
      const userId = request.headers.get('x-user-id');
      
      if (!userId) {
        return createErrorResponse("Unauthorized: Authentication required", 401);
      }

      // Call the handler with the user ID
      return await handler(request, userId);
    } catch (error) {
      console.error("API error:", error);
      
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('Unauthorized') || errorMessage.includes('authentication')) {
          return createErrorResponse(errorMessage, 401);
        }
        
        return createErrorResponse(errorMessage, 400);
      }
      
      return createErrorResponse("An unexpected error occurred", 500);
    }
  };
}

/**
 * Verify that a requested userId matches the authenticated userId
 * with enhanced error handling for session issues
 */
export function verifyUserId(
  requestedUserId: string | null,
  authenticatedUserId: string
): string {
  if (!requestedUserId) {
    return authenticatedUserId;
  }

  if (requestedUserId !== authenticatedUserId) {
    throw new Error('Unauthorized: User ID mismatch');
  }

  return authenticatedUserId;
}

/**
 * Helper function to handle session-related errors
 * Useful for debugging auth issues in Next.js + Auth.js
 */
export function handleSessionError(error: unknown): NextResponse {
  console.error("Session error:", error);
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : "Unknown session error";
    
  // If the error contains HTML (like when we get a <!DOCTYPE> response)
  if (typeof errorMessage === 'string' && 
      (errorMessage.includes('<!DOCTYPE') || errorMessage.includes('<html'))) {
    return createErrorResponse(
      "Invalid session response format. The server returned HTML instead of JSON.", 
      500
    );
  }
  
  return createErrorResponse(
    `Session error: ${errorMessage}`, 
    401
  );
}

/**
 * Parse JSON safely with error handling
 */
export function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
}