import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Single query with joins to get all data at once
    const kanaWithAccuracy = await prisma.kana.findMany({
      include: {
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

    // Transform the data
    const result = kanaWithAccuracy.map((kana) => {
      const userAccuracy = kana.userAccuracy[0]; // Should be 0 or 1 record
      return {
        id: kana.id,
        character: kana.character,
        romaji: kana.romaji,
        attempts: userAccuracy?.attempts || 0,
        correct_attempts: userAccuracy?.correct_attempts || 0,
        accuracy: userAccuracy?.accuracy || 0,
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