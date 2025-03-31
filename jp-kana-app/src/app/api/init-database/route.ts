import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { KanaType } from "@/types/kana";

// Define interfaces for character data
interface Character {
  kana: string;
  romaji: string;
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
        { kana: "あ", romaji: "a", type: KanaType.hiragana },
        { kana: "い", romaji: "i", type: KanaType.hiragana },
        { kana: "う", romaji: "u", type: KanaType.hiragana },
        { kana: "え", romaji: "e", type: KanaType.hiragana },
        { kana: "お", romaji: "o", type: KanaType.hiragana },
        // K-row
        { kana: "か", romaji: "ka", type: KanaType.hiragana },
        { kana: "き", romaji: "ki", type: KanaType.hiragana },
        { kana: "く", romaji: "ku", type: KanaType.hiragana },
        { kana: "け", romaji: "ke", type: KanaType.hiragana },
        { kana: "こ", romaji: "ko", type: KanaType.hiragana },
        // S-row
        { kana: "さ", romaji: "sa", type: KanaType.hiragana },
        { kana: "し", romaji: "shi", type: KanaType.hiragana },
        { kana: "す", romaji: "su", type: KanaType.hiragana },
        { kana: "せ", romaji: "se", type: KanaType.hiragana },
        { kana: "そ", romaji: "so", type: KanaType.hiragana },
        // T-row
        { kana: "た", romaji: "ta", type: KanaType.hiragana },
        { kana: "ち", romaji: "chi", type: KanaType.hiragana },
        { kana: "つ", romaji: "tsu", type: KanaType.hiragana },
        { kana: "て", romaji: "te", type: KanaType.hiragana },
        { kana: "と", romaji: "to", type: KanaType.hiragana },
        // N-row
        { kana: "な", romaji: "na", type: KanaType.hiragana },
        { kana: "に", romaji: "ni", type: KanaType.hiragana },
        { kana: "ぬ", romaji: "nu", type: KanaType.hiragana },
        { kana: "ね", romaji: "ne", type: KanaType.hiragana },
        { kana: "の", romaji: "no", type: KanaType.hiragana },
      ];

      // Katakana characters
      const katakanaCharacters: Character[] = [
        { kana: "ア", romaji: "a", type: KanaType.katakana },
        { kana: "イ", romaji: "i", type: KanaType.katakana },
        { kana: "ウ", romaji: "u", type: KanaType.katakana },
        { kana: "エ", romaji: "e", type: KanaType.katakana },
        { kana: "オ", romaji: "o", type: KanaType.katakana },
        // K-row
        { kana: "カ", romaji: "ka", type: KanaType.katakana },
        { kana: "キ", romaji: "ki", type: KanaType.katakana },
        { kana: "ク", romaji: "ku", type: KanaType.katakana },
        { kana: "ケ", romaji: "ke", type: KanaType.katakana },
        { kana: "コ", romaji: "ko", type: KanaType.katakana },
        // S-row
        { kana: "サ", romaji: "sa", type: KanaType.katakana },
        { kana: "シ", romaji: "shi", type: KanaType.katakana },
        { kana: "ス", romaji: "su", type: KanaType.katakana },
        { kana: "セ", romaji: "se", type: KanaType.katakana },
        { kana: "ソ", romaji: "so", type: KanaType.katakana },
        // T-row
        { kana: "タ", romaji: "ta", type: KanaType.katakana },
        { kana: "チ", romaji: "chi", type: KanaType.katakana },
        { kana: "ツ", romaji: "tsu", type: KanaType.katakana },
        { kana: "テ", romaji: "te", type: KanaType.katakana },
        { kana: "ト", romaji: "to", type: KanaType.katakana },
        // N-row
        { kana: "ナ", romaji: "na", type: KanaType.katakana },
        { kana: "ニ", romaji: "ni", type: KanaType.katakana },
        { kana: "ヌ", romaji: "nu", type: KanaType.katakana },
        { kana: "ネ", romaji: "ne", type: KanaType.katakana },
        { kana: "ノ", romaji: "no", type: KanaType.katakana },
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
