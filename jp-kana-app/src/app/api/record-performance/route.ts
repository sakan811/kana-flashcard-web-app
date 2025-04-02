import { NextRequest } from "next/server";
import prisma from "../../../lib/prisma";
import { withAuth, verifyUserId, createErrorResponse, createSuccessResponse } from "@/lib/api-utils";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const { userId: requestedUserId, kana, kanaType, isCorrect } = body;

    // Verify the requested userId matches the authenticated userId
    const effectiveUserId = verifyUserId(requestedUserId, userId);

    if (!kana || !kanaType) {
      return createErrorResponse("Missing required parameters: kana or kanaType", 400);
    }

    console.log(`Recording performance for user ${effectiveUserId}, kana ${kana}, type ${kanaType}, correct: ${isCorrect}`);

    // Test database connection before proceeding
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return createErrorResponse("Database connection failed", 503);
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: effectiveUserId },
    });

    if (!user) {
      return createErrorResponse("User not found in database", 404);
    }

    // Get the correct romaji for this kana
    const flashcard = await prisma.flashcard.findFirst({
      where: {
        kana: kana,
        type: kanaType,
      },
    });

    if (!flashcard) {
      return createErrorResponse("Kana character not found in database", 404);
    }

    // Update UserKanaPerformance table
    await prisma.userKanaPerformance.upsert({
      where: {
        userId_kana: {
          userId: user.id,
          kana: kana,
        },
      },
      update: {
        correctCount: { increment: isCorrect ? 1 : 0 },
        totalCount: { increment: 1 },
        lastPracticed: new Date(),
      },
      create: {
        userId: user.id,
        kana: kana,
        kanaType: kanaType,
        correctCount: isCorrect ? 1 : 0,
        totalCount: 1,
        lastPracticed: new Date(),
      },
    });

    // Get updated performance stats for this kana
    const performance = await prisma.userKanaPerformance.findUnique({
      where: {
        userId_kana: {
          userId: user.id,
          kana: kana,
        },
      },
    });

    // Calculate accuracy percentage
    const accuracy = performance
      ? Math.round((performance.correctCount / performance.totalCount) * 100)
      : 0;

    // Return detailed feedback
    return createSuccessResponse({
      success: true,
      isCorrect: isCorrect,
      message: isCorrect
        ? `Correct! "${kana}" is indeed "${flashcard.romaji}".`
        : `Incorrect. "${kana}" is pronounced "${flashcard.romaji}".`,
      stats: {
        correctCount: performance?.correctCount || 0,
        totalCount: performance?.totalCount || 0,
        accuracy: accuracy,
        kana: kana,
        romaji: flashcard.romaji,
        kanaType: kanaType,
      },
    });
  } catch (error) {
    console.error("Error recording performance:", error);
    
    if (error instanceof Error && error.message === "User ID does not match authenticated session") {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse("Failed to record performance", 500);
  }
});
