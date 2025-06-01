import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { kanaId, isCorrect } = await request.json();

    // Find or create KanaProgress record
    const kanaProgress = await prisma.kanaProgress.upsert({
      where: {
        kana_id: kanaId,
      },
      update: {
        attempts: { increment: 1 },
        correct_attempts: isCorrect ? { increment: 1 } : undefined,
      },
      create: {
        kana_id: kanaId,
        attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
      },
    });

    // Calculate and update accuracy
    const accuracy = kanaProgress.correct_attempts / kanaProgress.attempts;

    await prisma.kanaProgress.update({
      where: { id: kanaProgress.id },
      data: { accuracy },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
