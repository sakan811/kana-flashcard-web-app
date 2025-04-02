import { NextRequest, NextResponse } from "next/server";

/**
 * Type definition for the handler function to be wrapped with authentication
 */
export type ApiHandler = (
  request: NextRequest,
  userId: string
) => Promise<NextResponse>;

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

/**
 * Middleware to handle API authentication and common error patterns
 * @param handler The API route handler function
 * @returns A wrapped handler with authentication and error handling
 */
export function withAuth(handler: ApiHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Get user ID from request headers (set by middleware)
      const userId = request.headers.get('x-user-id');
      
      // If no user ID in headers, return unauthorized
      if (!userId) {
        console.error("No user ID found in request headers");
        return createErrorResponse("Unauthorized: No authenticated session found", 401);
      }

      // Execute the provided handler with the authenticated user ID
      return await handler(request, userId);
    } catch (error) {
      console.error("API error:", error);
      return createErrorResponse(
        error instanceof Error ? error.message : "Internal server error", 
        500
      );
    }
  };
}

/**
 * Verify that a requested userId matches the authenticated userId
 * @param requestedUserId The userId requested in the API call
 * @param authenticatedUserId The authenticated userId from the session
 * @returns true if the IDs match or requestedUserId is not provided
 * @throws Error if the IDs don't match
 */
export function verifyUserId(requestedUserId: string | null, authenticatedUserId: string): string {
  // If no requestedUserId is provided, use the authenticated ID
  if (!requestedUserId) {
    return authenticatedUserId;
  }
  
  // Verify userId matches authenticated user
  if (requestedUserId !== authenticatedUserId) {
    console.error("User ID mismatch:", { requestedUserId, authenticatedUserId });
    throw new Error("User ID does not match authenticated session");
  }
  
  return requestedUserId;
}

/**
 * Create a standardized error response
 * @param message Error message
 * @param status HTTP status code
 * @param details Optional additional error details
 * @returns NextResponse with error data
 */
export function createErrorResponse(
  message: string, 
  status: number = 400, 
  details?: unknown
): NextResponse {
  const errorResponse: ApiErrorResponse = { 
    error: message 
  };
  
  if (details) {
    errorResponse.details = details;
  }
  
  return NextResponse.json(errorResponse, { status });
}

/**
 * Create a standardized success response
 * @param data Response data
 * @param status HTTP status code
 * @returns NextResponse with success data
 */
export function createSuccessResponse(data: unknown, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
} 