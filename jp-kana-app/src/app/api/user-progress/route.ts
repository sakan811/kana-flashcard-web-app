import { NextRequest } from "next/server";
import prisma, { getUserProgressWithFlashcard } from "../../../lib/prisma";
import { withAuth, verifyUserId, createErrorResponse, createSuccessResponse } from "@/lib/api-utils";

export const GET = withAuth(async (request: NextRequest, userId: string) => {
  const searchParams = request.nextUrl.searchParams;
  const requestedUserId = searchParams.get("userId");

  try {
    // Verify the requested userId matches the authenticated userId
    const effectiveUserId = verifyUserId(requestedUserId, userId);
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get user progress with flashcard data
    const progressData = await getUserProgressWithFlashcard(effectiveUserId);

    // Transform data for easier consumption by the frontend
    const formattedProgress = progressData
      .map((progress) => {
        if (!progress.flashcard) {
          return null;
        }

        return {
          flashcardId: progress.flashcard.id,
          kana: progress.flashcard.kana,
          romaji: progress.flashcard.romaji,
          type: progress.flashcard.type,
          correctCount: progress.correctCount,
          incorrectCount: progress.totalCount - progress.correctCount,
          totalCount: progress.totalCount,
          accuracy:
            progress.totalCount > 0
              ? (progress.correctCount / progress.totalCount) * 100
              : 0,
          lastPracticed: progress.lastPracticed,
        };
      })
      .filter(Boolean); // Remove nulls (entries without flashcard)

    return createSuccessResponse(formattedProgress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return createErrorResponse(
      "Database connection error. Please check your database configuration and environment variables.",
      500
    );
  }
});
