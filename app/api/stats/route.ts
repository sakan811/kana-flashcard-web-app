import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all kana with user accuracy data
    const stats = await prisma.kana.findMany({
      select: {
        id: true,
        character: true,
        romaji: true,
        userAccuracy: {
          where: {
            user_email: session.user.email,
          },
          select: {
            attempts: true,
            correct_attempts: true,
            accuracy: true,
          },
        },
      },
    });

    // Format the response
    const formattedStats = stats.map((kana) => {
      const userAccuracy = kana.userAccuracy[0] || {
        attempts: 0,
        correct_attempts: 0,
        accuracy: 0,
      };
      return {
        id: kana.id,
        character: kana.character,
        romaji: kana.romaji,
        attempts: userAccuracy.attempts,
        correct_attempts: userAccuracy.correct_attempts,
        accuracy: userAccuracy.accuracy,
      };
    });

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
