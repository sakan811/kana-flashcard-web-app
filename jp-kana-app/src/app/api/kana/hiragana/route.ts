import { NextResponse } from "next/server";
import { Character, KanaType } from "@/types/kana";

const hiraganaData: Character[] = [
  { kana: "あ", romaji: "a", type: KanaType.hiragana, weight: 1 },
  { kana: "い", romaji: "i", type: KanaType.hiragana, weight: 1 },
  { kana: "う", romaji: "u", type: KanaType.hiragana, weight: 1 },
  { kana: "え", romaji: "e", type: KanaType.hiragana, weight: 1 },
  { kana: "お", romaji: "o", type: KanaType.hiragana, weight: 1 },
];

export async function GET() {
  try {
    const data = await Promise.all(
      hiraganaData.map(async (card) => ({
        kana: card.kana,
        romanji: card.romaji,
        type: card.type,
        weight: card.weight,
      })),
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching hiragana data:", error);
    return NextResponse.json(
      { error: "Failed to fetch hiragana data" },
      { status: 500 },
    );
  }
}
