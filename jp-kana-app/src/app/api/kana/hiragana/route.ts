import { NextResponse } from "next/server";
import { hiraganaData } from "@/lib/kana-data";

export async function GET() {
  try {
    const data = hiraganaData.map(card => ({
      kana: card.kana,
      romaji: card.romaji,
      type: card.type,
      weight: card.weight,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching hiragana data:", error);
    return NextResponse.json(
      { error: "Failed to fetch hiragana data" },
      { status: 500 },
    );
  }
}
