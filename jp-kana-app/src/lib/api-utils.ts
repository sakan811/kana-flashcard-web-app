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
 * Middleware to handle API authentication and common error patterns
 * Follows the proximity principle by checking auth directly where data is accessed
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
      
      // Handle known error types
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          return createErrorResponse(`Authentication error: ${error.message}`, 401);
        }
        if (error.message.includes('Forbidden')) {
          return createErrorResponse(error.message, 403);
        }
        if (error.message.includes('Not found')) {
          return createErrorResponse(error.message, 404);
        }
        return createErrorResponse(error.message, 400);
      }
      
      // Generic error response
      return createErrorResponse("An unexpected error occurred", 500);
    }
  };
}

/**
 * Verify that a requested userId matches the authenticated userId
 * Implements the proximity principle by verifying user access at the point of data access
 * @param requestedUserId The userId requested in the API call
 * @param authenticatedUserId The authenticated userId from the session
 * @returns The validated userId to use
 */
export function verifyUserId(
  requestedUserId: string | null,
  authenticatedUserId: string
): string {
  // If no specific user ID was requested, use the authenticated user's ID
  if (!requestedUserId) {
    return authenticatedUserId;
  }

  // If a specific user ID was requested, verify it matches the authenticated user
  if (requestedUserId !== authenticatedUserId) {
    throw new Error('Forbidden: You can only access your own data');
  }

  return authenticatedUserId;
}