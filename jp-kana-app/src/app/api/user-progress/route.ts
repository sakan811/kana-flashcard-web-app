import { NextRequest, NextResponse } from "next/server";
import prisma, { getUserProgressWithFlashcard } from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "current-user";

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get user progress with flashcard data
    const progressData = await getUserProgressWithFlashcard(userId);

    // Transform data for easier consumption by the frontend
    const formattedProgress = progressData
      .map((progress) => {
        if (!progress.flashcard) {
          return null;
        }

        return {
          flashcardId: progress.flashcard.id, // Using flashcard ID instead of non-existent flashcardId
          kana: progress.flashcard.kana,
          romaji: progress.flashcard.romaji,
          type: progress.flashcard.type,
          correctCount: progress.correctCount,
          incorrectCount: progress.totalCount - progress.correctCount, // Calculate incorrectCount from totalCount - correctCount
          totalCount: progress.totalCount,
          accuracy:
            progress.totalCount > 0
              ? (progress.correctCount / progress.totalCount) * 100
              : 0,
          lastPracticed: progress.lastPracticed,
        };
      })
      .filter(Boolean); // Remove nulls (entries without flashcard)

    return NextResponse.json(formattedProgress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      {
        error:
          "Database connection error. Please check your database configuration and environment variables.",
      },
      { status: 500 },
    );
  }
}
