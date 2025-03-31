import { NextResponse } from "next/server";
import { Character, KanaType } from "@/types/kana";

const katakanaData: Character[] = [
  { kana: "ア", romaji: "a", type: KanaType.katakana, weight: 1 },
  { kana: "イ", romaji: "i", type: KanaType.katakana, weight: 1 },
  { kana: "ウ", romaji: "u", type: KanaType.katakana, weight: 1 },
  { kana: "エ", romaji: "e", type: KanaType.katakana, weight: 1 },
  { kana: "オ", romaji: "o", type: KanaType.katakana, weight: 1 },
];

export async function GET() {
  try {
    const data = await Promise.all(
      katakanaData.map(async (card) => ({
        kana: card.kana,
        romaji: card.romaji,
        type: card.type,
        weight: card.weight,
      })),
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching katakana data:", error);
    return NextResponse.json(
      { error: "Failed to fetch katakana data" },
      { status: 500 },
    );
  }
}
