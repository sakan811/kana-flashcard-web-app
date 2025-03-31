import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { Character } from "../../../types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, kanaType, characters } = body;

    if (!userId || !kanaType || !characters || !Array.isArray(characters)) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get all performance data for this user and kana type
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: userId,
        kanaType: kanaType,
      },
    });

    // Convert to a more usable format with accuracy calculated
    const performanceData = performances.map((perf) => ({
      kana: perf.kana,
      kanaType: perf.kanaType,
      correctCount: perf.correctCount,
      totalCount: perf.totalCount,
      accuracy:
        perf.totalCount > 0 ? (perf.correctCount / perf.totalCount) * 100 : 0,
    }));

    // Calculate weights for each character
    const charactersWithWeights = characters.map((char: Character) => {
      const kanaValue = kanaType === "hiragana" ? char.hiragana : char.katakana;
      const performance = performanceData.find((p) => p.kana === kanaValue);

      if (performance) {
        // Convert accuracy percentage to decimal (0-1 range)
        const accuracyDecimal = performance.accuracy / 100;

        // Start with inverse accuracy (0% accuracy → 1.0, 100% accuracy → 0.0)
        const inverseAccuracy = 1 - accuracyDecimal;

        // Apply exponential curve to prioritize lower accuracy kana more aggressively
        const exponentialFactor = Math.pow(inverseAccuracy, 2);

        // Scale to 1-15 range and ensure minimum weight of 1
        const weight = Math.max(1, 1 + 14 * exponentialFactor);

        return { ...char, weight };
      }

      // Default weight for untrained kana is higher to prioritize new characters
      return { ...char, weight: 5 };
    });

    return NextResponse.json(charactersWithWeights);
  } catch (error) {
    console.error("Error getting kana weights:", error);
    return NextResponse.json(
      {
        error:
          "Database connection error. Please check your database configuration and environment variables.",
      },
      { status: 500 },
    );
  }
}
