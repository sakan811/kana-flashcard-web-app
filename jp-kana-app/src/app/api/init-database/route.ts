import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { KanaType } from "@/types";

// Define interfaces for character data
interface Character {
  kana: string;
  romanji: string;
  type: KanaType;
}

// Initialize database with Kana characters
export async function POST() {
  try {
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Clear existing flashcards
      await tx.flashcard.deleteMany();

      // Hiragana characters
      const hiraganaCharacters: Character[] = [
        { kana: "あ", romanji: "a", type: "hiragana" },
        { kana: "い", romanji: "i", type: "hiragana" },
        { kana: "う", romanji: "u", type: "hiragana" },
        { kana: "え", romanji: "e", type: "hiragana" },
        { kana: "お", romanji: "o", type: "hiragana" },
        // K-row
        { kana: "か", romanji: "ka", type: "hiragana" },
        { kana: "き", romanji: "ki", type: "hiragana" },
        { kana: "く", romanji: "ku", type: "hiragana" },
        { kana: "け", romanji: "ke", type: "hiragana" },
        { kana: "こ", romanji: "ko", type: "hiragana" },
        // S-row
        { kana: "さ", romanji: "sa", type: "hiragana" },
        { kana: "し", romanji: "shi", type: "hiragana" },
        { kana: "す", romanji: "su", type: "hiragana" },
        { kana: "せ", romanji: "se", type: "hiragana" },
        { kana: "そ", romanji: "so", type: "hiragana" },
        // T-row
        { kana: "た", romanji: "ta", type: "hiragana" },
        { kana: "ち", romanji: "chi", type: "hiragana" },
        { kana: "つ", romanji: "tsu", type: "hiragana" },
        { kana: "て", romanji: "te", type: "hiragana" },
        { kana: "と", romanji: "to", type: "hiragana" },
        // N-row
        { kana: "な", romanji: "na", type: "hiragana" },
        { kana: "に", romanji: "ni", type: "hiragana" },
        { kana: "ぬ", romanji: "nu", type: "hiragana" },
        { kana: "ね", romanji: "ne", type: "hiragana" },
        { kana: "の", romanji: "no", type: "hiragana" },
      ];

      // Katakana characters
      const katakanaCharacters: Character[] = [
        { kana: "ア", romanji: "a", type: "katakana" },
        { kana: "イ", romanji: "i", type: "katakana" },
        { kana: "ウ", romanji: "u", type: "katakana" },
        { kana: "エ", romanji: "e", type: "katakana" },
        { kana: "オ", romanji: "o", type: "katakana" },
        // K-row
        { kana: "カ", romanji: "ka", type: "katakana" },
        { kana: "キ", romanji: "ki", type: "katakana" },
        { kana: "ク", romanji: "ku", type: "katakana" },
        { kana: "ケ", romanji: "ke", type: "katakana" },
        { kana: "コ", romanji: "ko", type: "katakana" },
        // S-row
        { kana: "サ", romanji: "sa", type: "katakana" },
        { kana: "シ", romanji: "shi", type: "katakana" },
        { kana: "ス", romanji: "su", type: "katakana" },
        { kana: "セ", romanji: "se", type: "katakana" },
        { kana: "ソ", romanji: "so", type: "katakana" },
        // T-row
        { kana: "タ", romanji: "ta", type: "katakana" },
        { kana: "チ", romanji: "chi", type: "katakana" },
        { kana: "ツ", romanji: "tsu", type: "katakana" },
        { kana: "テ", romanji: "te", type: "katakana" },
        { kana: "ト", romanji: "to", type: "katakana" },
        // N-row
        { kana: "ナ", romanji: "na", type: "katakana" },
        { kana: "ニ", romanji: "ni", type: "katakana" },
        { kana: "ヌ", romanji: "nu", type: "katakana" },
        { kana: "ネ", romanji: "ne", type: "katakana" },
        { kana: "ノ", romanji: "no", type: "katakana" },
      ];

      // Create all flashcards
      const allCharacters = [...hiraganaCharacters, ...katakanaCharacters];
      await tx.flashcard.createMany({
        data: allCharacters,
      });

      return { success: true, count: allCharacters.length };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 },
    );
  }
}
