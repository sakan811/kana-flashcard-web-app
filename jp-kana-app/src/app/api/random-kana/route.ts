import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { KanaType } from "@/types/kana";
import { withAuth, verifyUserId, createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { getKanaByType, getKanaById, Kana } from "@/lib/kana-data";

/**
 * GET /api/random-kana
 * Returns weighted random kana characters for flashcards
 * Uses the centralized kana data store and applies user performance weighting
 */
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    // Extract parameters
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");
    const kanaTypeParam = searchParams.get("kanaType") as 'hiragana' | 'katakana' | null;
    
    // Verify the requested userId matches the authenticated userId
    const effectiveUserId = verifyUserId(requestedUserId, userId);

    // Validate kanaType
    if (kanaTypeParam !== "hiragana" && kanaTypeParam !== "katakana" && kanaTypeParam !== null) {
      return createErrorResponse(
        'Invalid kanaType: must be "hiragana", "katakana", or not specified',
        400
      );
    }

    // Get kana from centralized data store based on type
    const availableKana = kanaTypeParam ? 
      getKanaByType(kanaTypeParam) : 
      [...getKanaByType('hiragana'), ...getKanaByType('katakana')];

    if (availableKana.length === 0) {
      return createErrorResponse(
        "No kana found for the specified type",
        404
      );
    }

    // Get user performance data for all kana
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: effectiveUserId,
        ...(kanaTypeParam && { kanaType: kanaTypeParam }),
      },
    });

    // Calculate weights based on performance
    const weightedKana = availableKana.map((kana) => {
      // Find matching performance data for this kana
      const performance = performances.find((p) => p.kana === kana.character);

      // Default weight for untrained kana is higher to prioritize new characters
      let weight = 5;

      if (performance) {
        const totalAttempts = performance.totalCount;
        if (totalAttempts > 0) {
          const accuracy = performance.correctCount / totalAttempts;
          
          // Enhanced weight calculation with spaced repetition principles:
          // 1. Base inverse relationship: lower accuracy = higher weight
          // 2. Apply exponential scaling to further prioritize low accuracy kana
          // 3. Ensure weight is between 1-15 (wider range for better differentiation)
          
          // Start with inverse accuracy (0% accuracy → 1.0, 100% accuracy → 0.0)
          const inverseAccuracy = 1 - accuracy;

          // Apply exponential curve to prioritize lower accuracy kana more aggressively
          const exponentialFactor = Math.pow(inverseAccuracy, 2);

          // Scale to 1-15 range and ensure minimum weight of 1
          weight = Math.max(1, 1 + 14 * exponentialFactor);

          // Apply minimum threshold - even well-known kana need occasional review
          weight = Math.max(weight, 1);
        }
      }

      return {
        ...kana,
        weight,
        correctCount: performance?.correctCount || 0,
        totalCount: performance?.totalCount || 0,
        accuracy:
          performance && performance.totalCount > 0
            ? (performance.correctCount / performance.totalCount) * 100
            : 0,
      };
    });

    // Implement weighted random selection
    const totalWeight = weightedKana.reduce(
      (sum, card) => sum + card.weight,
      0,
    );
    let random = Math.random() * totalWeight;

    let selectedKana = weightedKana[0]; // Default to first kana

    for (const kana of weightedKana) {
      random -= kana.weight;
      if (random <= 0) {
        selectedKana = kana;
        break;
      }
    }

    return createSuccessResponse(selectedKana);
  } catch (error) {
    console.error("Error getting random kana:", error);
    
    if (error instanceof Error && error.message === "User ID does not match authenticated session") {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse("Failed to get random kana", 500);
  }
});
