import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Single query with joins
    const kanaWithAccuracy = await prisma.kana.findMany({
      include: {
        userAccuracy: {
          where: {
            user_email: session.user.email,
          },
          select: {
            accuracy: true,
          },
        },
      },
    });

    // Transform the data
    const result = kanaWithAccuracy.map((kana) => ({
      id: kana.id,
      character: kana.character,
      romaji: kana.romaji,
      accuracy: kana.userAccuracy[0]?.accuracy || 0,
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