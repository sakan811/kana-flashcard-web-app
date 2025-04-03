import { NextRequest, NextResponse } from "next/server";
import { getAllKana, getKanaByType } from "@/lib/kana-data";
import { KanaType } from "@/types/kana";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  try {
    if (type === "hiragana") {
      return NextResponse.json(getKanaByType(KanaType.hiragana));
    } else if (type === "katakana") {
      return NextResponse.json(getKanaByType(KanaType.katakana));
    } else {
      return NextResponse.json(getAllKana());
    }
  } catch (error) {
    console.error("Error fetching kana data:", error);
    return NextResponse.json(
      { error: "Failed to fetch kana data" },
      { status: 500 }
    );
  }
}
