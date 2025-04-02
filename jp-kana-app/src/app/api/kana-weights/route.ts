import { NextRequest } from "next/server";
import prisma from "../../../lib/prisma";
import { Character } from "@/types/kana";
import { withAuth, verifyUserId, createErrorResponse, createSuccessResponse } from "@/lib/api-utils";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    const { userId: requestedUserId, kanaType, characters } = body;

    // Verify the requested userId matches the authenticated userId
    const effectiveUserId = verifyUserId(requestedUserId, userId);

    if (!kanaType || !characters || !Array.isArray(characters)) {
      return createErrorResponse("Missing required parameters", 400);
    }

    console.log(`Calculating weights for user ${effectiveUserId} and kana type ${kanaType}`);

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get all performance data for this user and kana type
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: effectiveUserId,
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
      // Use the kana property directly since it contains the character
      const kanaValue = char.kana;

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

    return createSuccessResponse(charactersWithWeights);
  } catch (error) {
    console.error("Error getting kana weights:", error);
    
    if (error instanceof Error && error.message === "User ID does not match authenticated session") {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse(
      "Database connection error. Please check your database configuration and environment variables.",
      500
    );
  }
});
