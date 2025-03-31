import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { KanaType } from "../../../types/kana";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, kana, kanaType, isCorrect, flashcardId } = body;

    if (!userId || !kana || !kanaType) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check if user exists first
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Using a transaction to ensure consistency across both tables
    await prisma.$transaction(async (tx) => {
      // Update UserKanaPerformance table
      await tx.userKanaPerformance.upsert({
        where: {
          userId_kana: {
            userId: userId,
            kana: kana,
          },
        },
        update: {
          correctCount: { increment: isCorrect ? 1 : 0 },
          totalCount: { increment: 1 },
          lastPracticed: new Date(),
        },
        create: {
          userId: userId,
          kana: kana,
          kanaType: kanaType,
          correctCount: isCorrect ? 1 : 0,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });

      // If flashcardId is provided, also update UserProgress table
      if (flashcardId) {
        const flashcard = await tx.flashcard.findUnique({
          where: { id: flashcardId }
        });

        if (!flashcard) {
          throw new Error("Flashcard not found");
        }

        await tx.userProgress.upsert({
          where: {
            userId_flashcardId: {
              userId: userId,
              flashcardId: flashcardId,
            },
          },
          update: {
            correctCount: { increment: isCorrect ? 1 : 0 },
            incorrectCount: { increment: isCorrect ? 0 : 1 },
            lastPracticed: new Date(),
          },
          create: {
            userId: userId,
            flashcardId: flashcardId,
            correctCount: isCorrect ? 1 : 0,
            incorrectCount: isCorrect ? 0 : 1,
            lastPracticed: new Date(),
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording performance:", error);
    return NextResponse.json(
      {
        error: "Database operation failed",
      },
      { status: 500 },
    );
  }
}
