import { NextResponse } from "next/server";
import { katakanaData } from "@/lib/kana-data";

export async function GET() {
  try {
    const data = katakanaData.map(card => ({
      kana: card.kana,
      romaji: card.romaji,
      type: card.type,
      weight: card.weight,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching katakana data:", error);
    return NextResponse.json(
      { error: "Failed to fetch katakana data" },
      { status: 500 },
    );
  }
}
