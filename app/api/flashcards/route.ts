import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Single query with joins
    const kanaWithProgress = await prisma.kana.findMany({
      include: {
        progress: {
          select: {
            accuracy: true,
          },
        },
      },
    });

    // Transform the data
    const result = kanaWithProgress.map((kana) => ({
      id: kana.id,
      character: kana.character,
      romaji: kana.romaji,
      accuracy: kana.progress[0]?.accuracy || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching kana data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}