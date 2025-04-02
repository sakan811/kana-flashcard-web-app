import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication using the new auth() function
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "No authenticated session found" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { userId, kana, kanaType, isCorrect } = body;

    // Verify userId matches authenticated user
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "User ID does not match authenticated session" },
        { status: 401 },
      );
    }

    if (!userId || !kana || !kanaType) {
      return NextResponse.json(
        { error: "Missing required parameters: userId, kana, or kanaType" },
        { status: 400 },
      );
    }

    // Test database connection before proceeding
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 },
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    // Get the correct romaji for this kana
    const flashcard = await prisma.flashcard.findFirst({
      where: {
        kana: kana,
        type: kanaType,
      },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Kana character not found in database" },
        { status: 404 },
      );
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
    return NextResponse.json({
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
    return NextResponse.json(
      { error: "Failed to record performance" },
      { status: 500 },
    );
  }
}
