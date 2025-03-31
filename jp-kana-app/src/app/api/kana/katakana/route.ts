import { NextResponse } from "next/server";
import { Character } from "@/types";

const katakanaData: Character[] = [
  { kana: "ア", romanji: "a", type: "katakana", weight: 1 },
  { kana: "イ", romanji: "i", type: "katakana", weight: 1 },
  { kana: "ウ", romanji: "u", type: "katakana", weight: 1 },
  { kana: "エ", romanji: "e", type: "katakana", weight: 1 },
  { kana: "オ", romanji: "o", type: "katakana", weight: 1 },
];

export async function GET() {
  try {
    const data = await Promise.all(
      katakanaData.map(async (card) => ({
        kana: card.kana,
        romanji: card.romanji,
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
