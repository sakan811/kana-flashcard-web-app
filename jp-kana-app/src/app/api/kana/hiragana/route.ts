import { NextResponse } from "next/server";
import { Character } from "@/types";

const hiraganaData: Character[] = [
  { kana: "あ", romanji: "a", type: "hiragana", weight: 1 },
  { kana: "い", romanji: "i", type: "hiragana", weight: 1 },
  { kana: "う", romanji: "u", type: "hiragana", weight: 1 },
  { kana: "え", romanji: "e", type: "hiragana", weight: 1 },
  { kana: "お", romanji: "o", type: "hiragana", weight: 1 },
];

export async function GET() {
  try {
    const data = await Promise.all(
      hiraganaData.map(async (card) => ({
        kana: card.kana,
        romanji: card.romanji,
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
