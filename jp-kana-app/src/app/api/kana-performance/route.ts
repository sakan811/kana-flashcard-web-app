import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "current-user";
  const kanaType = searchParams.get("kanaType") as
    | "hiragana"
    | "katakana"
    | null;

  if (!kanaType) {
    return NextResponse.json(
      { error: "Missing kanaType parameter" },
      { status: 400 },
    );
  }

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: userId,
        kanaType: kanaType,
      },
    });

    const performanceData = performances.map((perf) => ({
      kana: perf.kana,
      kanaType: perf.kanaType,
      correctCount: perf.correctCount,
      totalCount: perf.totalCount,
      accuracy:
        perf.totalCount > 0 ? (perf.correctCount / perf.totalCount) * 100 : 0,
    }));

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error(`Error getting ${kanaType} performance:`, error);
    return NextResponse.json(
      {
        error:
          "Database connection error. Please check your database configuration and environment variables.",
      },
      { status: 500 },
    );
  }
}
