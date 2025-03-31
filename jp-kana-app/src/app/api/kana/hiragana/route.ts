import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { KanaType } from "@prisma/client";

// Define our Character interface
interface Character {
  hiragana?: string;
  katakana?: string;
  romanji: string;
  weight: number;
}

// Base hiragana list as fallback
const hiraganaList: Character[] = [
  // Basic vowels
  { hiragana: "あ", romanji: "a", weight: 1 },
  { hiragana: "い", romanji: "i", weight: 1 },
  { hiragana: "う", romanji: "u", weight: 1 },
  { hiragana: "え", romanji: "e", weight: 1 },
  { hiragana: "お", romanji: "o", weight: 1 },
  // Add more hiragana characters as needed
];

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Extract userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // If no userId, return the default list
    if (!userId) {
      return NextResponse.json({
        success: true,
        data: hiraganaList,
      });
    }

    // Fetch flashcards with user progress
    const flashcards = await prisma.flashcard.findMany({
      where: { type: KanaType.hiragana },
      include: {
        progress: {
          where: { userId },
        },
      },
    });

    // Map flashcards to characters with weights
    const characterList = flashcards.map((card) => {
      const progress = card.progress[0];

      // Calculate weight based on user performance
      let weight = 1;
      if (progress) {
        const totalAttempts = progress.correctCount + progress.incorrectCount;
        if (totalAttempts > 0) {
          const accuracy = progress.correctCount / totalAttempts;
          // Inverse relationship: lower accuracy = higher weight
          weight = 1 + (1 - accuracy) * 2;
        }
      }

      return {
        hiragana: card.kana,
        romanji: card.romaji,
        weight,
      };
    });

    return NextResponse.json({
      success: true,
      data: characterList.length > 0 ? characterList : hiraganaList,
    });
  } catch (error) {
    console.error("Error fetching hiragana list:", error);
    return NextResponse.json({
      success: true, // Changed to true - keep UI working even with error
      message: "Using default hiragana list due to error",
      data: hiraganaList,
    });
  }
}
