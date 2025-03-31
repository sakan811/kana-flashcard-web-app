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
      // Clear existing user progress first due to foreign key constraints
      await tx.userProgress.deleteMany();
      // Clear user kana performance records
      await tx.userKanaPerformance.deleteMany();
      // Then clear existing flashcards
      await tx.flashcard.deleteMany();

      // Hiragana characters
      const hiraganaCharacters: Character[] = [
        // Vowels
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
        // H-row
        { kana: "は", romaji: "ha", type: KanaType.hiragana },
        { kana: "ひ", romaji: "hi", type: KanaType.hiragana },
        { kana: "ふ", romaji: "fu", type: KanaType.hiragana },
        { kana: "へ", romaji: "he", type: KanaType.hiragana },
        { kana: "ほ", romaji: "ho", type: KanaType.hiragana },
        // M-row
        { kana: "ま", romaji: "ma", type: KanaType.hiragana },
        { kana: "み", romaji: "mi", type: KanaType.hiragana },
        { kana: "む", romaji: "mu", type: KanaType.hiragana },
        { kana: "め", romaji: "me", type: KanaType.hiragana },
        { kana: "も", romaji: "mo", type: KanaType.hiragana },
        // Y-row
        { kana: "や", romaji: "ya", type: KanaType.hiragana },
        { kana: "ゆ", romaji: "yu", type: KanaType.hiragana },
        { kana: "よ", romaji: "yo", type: KanaType.hiragana },
        // R-row
        { kana: "ら", romaji: "ra", type: KanaType.hiragana },
        { kana: "り", romaji: "ri", type: KanaType.hiragana },
        { kana: "る", romaji: "ru", type: KanaType.hiragana },
        { kana: "れ", romaji: "re", type: KanaType.hiragana },
        { kana: "ろ", romaji: "ro", type: KanaType.hiragana },
        // W-row
        { kana: "わ", romaji: "wa", type: KanaType.hiragana },
        { kana: "を", romaji: "wo", type: KanaType.hiragana },
        // N
        { kana: "ん", romaji: "n", type: KanaType.hiragana },
        // Dakuten variations (K → G)
        { kana: "が", romaji: "ga", type: KanaType.hiragana },
        { kana: "ぎ", romaji: "gi", type: KanaType.hiragana },
        { kana: "ぐ", romaji: "gu", type: KanaType.hiragana },
        { kana: "げ", romaji: "ge", type: KanaType.hiragana },
        { kana: "ご", romaji: "go", type: KanaType.hiragana },
        // Dakuten variations (S → Z)
        { kana: "ざ", romaji: "za", type: KanaType.hiragana },
        { kana: "じ", romaji: "ji", type: KanaType.hiragana },
        { kana: "ず", romaji: "zu", type: KanaType.hiragana },
        { kana: "ぜ", romaji: "ze", type: KanaType.hiragana },
        { kana: "ぞ", romaji: "zo", type: KanaType.hiragana },
        // Dakuten variations (T → D)
        { kana: "だ", romaji: "da", type: KanaType.hiragana },
        { kana: "ぢ", romaji: "ji", type: KanaType.hiragana },
        { kana: "づ", romaji: "zu", type: KanaType.hiragana },
        { kana: "で", romaji: "de", type: KanaType.hiragana },
        { kana: "ど", romaji: "do", type: KanaType.hiragana },
        // Dakuten variations (H → B)
        { kana: "ば", romaji: "ba", type: KanaType.hiragana },
        { kana: "び", romaji: "bi", type: KanaType.hiragana },
        { kana: "ぶ", romaji: "bu", type: KanaType.hiragana },
        { kana: "べ", romaji: "be", type: KanaType.hiragana },
        { kana: "ぼ", romaji: "bo", type: KanaType.hiragana },
        // Handakuten variations (H → P)
        { kana: "ぱ", romaji: "pa", type: KanaType.hiragana },
        { kana: "ぴ", romaji: "pi", type: KanaType.hiragana },
        { kana: "ぷ", romaji: "pu", type: KanaType.hiragana },
        { kana: "ぺ", romaji: "pe", type: KanaType.hiragana },
        { kana: "ぽ", romaji: "po", type: KanaType.hiragana },
      ];

      // Katakana characters
      const katakanaCharacters: Character[] = [
        // Vowels
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
        // H-row
        { kana: "ハ", romaji: "ha", type: KanaType.katakana },
        { kana: "ヒ", romaji: "hi", type: KanaType.katakana },
        { kana: "フ", romaji: "fu", type: KanaType.katakana },
        { kana: "ヘ", romaji: "he", type: KanaType.katakana },
        { kana: "ホ", romaji: "ho", type: KanaType.katakana },
        // M-row
        { kana: "マ", romaji: "ma", type: KanaType.katakana },
        { kana: "ミ", romaji: "mi", type: KanaType.katakana },
        { kana: "ム", romaji: "mu", type: KanaType.katakana },
        { kana: "メ", romaji: "me", type: KanaType.katakana },
        { kana: "モ", romaji: "mo", type: KanaType.katakana },
        // Y-row
        { kana: "ヤ", romaji: "ya", type: KanaType.katakana },
        { kana: "ユ", romaji: "yu", type: KanaType.katakana },
        { kana: "ヨ", romaji: "yo", type: KanaType.katakana },
        // R-row
        { kana: "ラ", romaji: "ra", type: KanaType.katakana },
        { kana: "リ", romaji: "ri", type: KanaType.katakana },
        { kana: "ル", romaji: "ru", type: KanaType.katakana },
        { kana: "レ", romaji: "re", type: KanaType.katakana },
        { kana: "ロ", romaji: "ro", type: KanaType.katakana },
        // W-row
        { kana: "ワ", romaji: "wa", type: KanaType.katakana },
        { kana: "ヲ", romaji: "wo", type: KanaType.katakana },
        // N
        { kana: "ン", romaji: "n", type: KanaType.katakana },
        // Dakuten variations (K → G)
        { kana: "ガ", romaji: "ga", type: KanaType.katakana },
        { kana: "ギ", romaji: "gi", type: KanaType.katakana },
        { kana: "グ", romaji: "gu", type: KanaType.katakana },
        { kana: "ゲ", romaji: "ge", type: KanaType.katakana },
        { kana: "ゴ", romaji: "go", type: KanaType.katakana },
        // Dakuten variations (S → Z)
        { kana: "ザ", romaji: "za", type: KanaType.katakana },
        { kana: "ジ", romaji: "ji", type: KanaType.katakana },
        { kana: "ズ", romaji: "zu", type: KanaType.katakana },
        { kana: "ゼ", romaji: "ze", type: KanaType.katakana },
        { kana: "ゾ", romaji: "zo", type: KanaType.katakana },
        // Dakuten variations (T → D)
        { kana: "ダ", romaji: "da", type: KanaType.katakana },
        { kana: "ヂ", romaji: "ji", type: KanaType.katakana },
        { kana: "ヅ", romaji: "zu", type: KanaType.katakana },
        { kana: "デ", romaji: "de", type: KanaType.katakana },
        { kana: "ド", romaji: "do", type: KanaType.katakana },
        // Dakuten variations (H → B)
        { kana: "バ", romaji: "ba", type: KanaType.katakana },
        { kana: "ビ", romaji: "bi", type: KanaType.katakana },
        { kana: "ブ", romaji: "bu", type: KanaType.katakana },
        { kana: "ベ", romaji: "be", type: KanaType.katakana },
        { kana: "ボ", romaji: "bo", type: KanaType.katakana },
        // Handakuten variations (H → P)
        { kana: "パ", romaji: "pa", type: KanaType.katakana },
        { kana: "ピ", romaji: "pi", type: KanaType.katakana },
        { kana: "プ", romaji: "pu", type: KanaType.katakana },
        { kana: "ペ", romaji: "pe", type: KanaType.katakana },
        { kana: "ポ", romaji: "po", type: KanaType.katakana },
      ];

      // Create all flashcards
      const allCharacters = [...hiraganaCharacters, ...katakanaCharacters];
      await tx.flashcard.createMany({
        data: allCharacters,
      });

      return { 
        success: true, 
        count: allCharacters.length,
        message: `Successfully initialized ${hiraganaCharacters.length} hiragana and ${katakanaCharacters.length} katakana characters (total: ${allCharacters.length})` 
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to initialize database",
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      },
      { status: 500 },
    );
  }
}
