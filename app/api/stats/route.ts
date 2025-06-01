import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Single query with joins to get all data at once
    const kanaWithProgress = await prisma.kana.findMany({
      include: {
        progress: {
          select: {
            attempts: true,
            correct_attempts: true,
            accuracy: true,
          },
        },
      },
    });

    // Transform the data
    const result = kanaWithProgress.map((kana) => {
      const progress = kana.progress[0]; // Should be 0 or 1 record
      return {
        id: kana.id,
        character: kana.character,
        romaji: kana.romaji,
        attempts: progress?.attempts || 0,
        correct_attempts: progress?.correct_attempts || 0,
        accuracy: progress?.accuracy || 0,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}