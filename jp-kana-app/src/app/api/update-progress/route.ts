import { NextRequest, NextResponse } from "next/server";
import prisma, { updateUserProgressRecord } from "../../../lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, flashcardId, kana, kanaType, isCorrect } = body;

    if (!userId || !flashcardId || !kana || !kanaType) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Transaction to update both UserProgress and UserKanaPerformance
    await prisma.$transaction(async (tx) => {
      // Update UserProgress
      await updateUserProgressRecord(userId, flashcardId, isCorrect);

      // Update UserKanaPerformance
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
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user progress:", error);
    return NextResponse.json(
      {
        error:
          "Database connection error. Please check your database configuration and environment variables.",
      },
      { status: 500 },
    );
  }
}
