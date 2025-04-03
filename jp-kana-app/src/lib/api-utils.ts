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
 * Simplified middleware to handle API authentication
 * @param handler The API route handler function
 * @returns A wrapped handler with authentication and error handling
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
        // Simplified error handling for common cases
        const errorMessage = error.message;
        
        if (errorMessage.includes('Unauthorized') || errorMessage.includes('authentication')) {
          return createErrorResponse(errorMessage, 401);
        }
        
        if (errorMessage.includes('database') || errorMessage.includes('connection')) {
          return createErrorResponse("Database error", 503);
        }
        
        return createErrorResponse(errorMessage, 400);
      }
      
      return createErrorResponse("An unexpected error occurred", 500);
    }
  };
}

/**
 * Verify that a requested userId matches the authenticated userId
 * @param requestedUserId The userId requested in the API call
 * @param authenticatedUserId The authenticated userId from the session
 * @returns The validated userId to use
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