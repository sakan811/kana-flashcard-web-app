import { NextRequest } from "next/server";
import prisma, { updateUserProgressRecord } from "../../../lib/prisma";
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

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get the flashcard
    const flashcard = await prisma.flashcard.findFirst({
      where: {
        kana,
        type: kanaType,
      },
    });

    if (!flashcard) {
      return createErrorResponse(`Flashcard not found for kana: ${kana}`, 404);
    }

    // Update user progress
    await updateUserProgressRecord(effectiveUserId, flashcard.id, isCorrect);

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("Error updating user progress:", error);
    return createErrorResponse("Database error occurred while updating progress", 500);
  }
});
