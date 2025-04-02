import { NextRequest } from "next/server";
import prisma from "../../../lib/prisma";
import { Character, KanaType } from "@/types/kana";
import { withAuth, verifyUserId, createErrorResponse, createSuccessResponse } from "@/lib/api-utils";

export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    // Extract parameters
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");
    const kanaTypeParam = searchParams.get("kanaType");

    // Verify the requested userId matches the authenticated userId
    const effectiveUserId = verifyUserId(requestedUserId, userId);

    // Validate kanaType
    if (kanaTypeParam !== "hiragana" && kanaTypeParam !== "katakana") {
      return createErrorResponse(
        'Invalid kanaType: must be "hiragana" or "katakana"',
        400
      );
    }

    console.log(`Fetching random kana for user ${effectiveUserId} and kana type ${kanaTypeParam}`);

    // Fetch all flashcards of the specified type
    const flashcards = await prisma.flashcard.findMany({
      where: { type: kanaTypeParam },
    });

    if (flashcards.length === 0) {
      return createErrorResponse(
        "No flashcards found for the specified type",
        404
      );
    }

    // Get user performance data for all kana of this type
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: effectiveUserId,
        kanaType: kanaTypeParam,
      },
    });

    // Calculate weights based on performance
    const weightedKana = flashcards.map((card) => {
      // Find matching performance data for this kana
      const performance = performances.find((p) => p.kana === card.kana);

      // Default weight for untrained kana is higher to prioritize new characters
      let weight = 5;

      if (performance) {
        const totalAttempts = performance.totalCount;
        if (totalAttempts > 0) {
          const accuracy = performance.correctCount / totalAttempts;
          // Enhanced weight calculation:
          // 1. Base inverse relationship: lower accuracy = higher weight
          // 2. Apply exponential scaling to further prioritize low accuracy kana
          // 3. Ensure weight is between 1-15 (wider range for better differentiation)
          // 4. Apply minimum exposure threshold for well-learned kana

          // Start with inverse accuracy (0% accuracy → 1.0, 100% accuracy → 0.0)
          const inverseAccuracy = 1 - accuracy;

          // Apply exponential curve to prioritize lower accuracy kana more aggressively
          // Square the inverse accuracy to emphasize lower values
          const exponentialFactor = Math.pow(inverseAccuracy, 2);

          // Scale to 1-15 range and ensure minimum weight of 1
          weight = Math.max(1, 1 + 14 * exponentialFactor);

          // Apply minimum threshold - even well-known kana need occasional review
          // This ensures all kana still have some chance of appearing
          weight = Math.max(weight, 1);
        }
      }

      return {
        id: card.id,
        kana: card.kana,
        romaji: card.romaji,
        type: card.type,
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

    let selectedCard = weightedKana[0]; // Default to first card

    for (const card of weightedKana) {
      random -= card.weight;
      if (random <= 0) {
        selectedCard = card;
        break;
      }
    }

    // Format the response to match the Character interface
    const response: Character & {
      correctCount: number;
      totalCount: number;
      accuracy: number;
    } = {
      id: selectedCard.id,
      kana: selectedCard.kana,
      romaji: selectedCard.romaji,
      type: selectedCard.type as KanaType | undefined,
      weight: selectedCard.weight,
      correctCount: selectedCard.correctCount,
      totalCount: selectedCard.totalCount,
      accuracy: selectedCard.accuracy,
    };

    return createSuccessResponse({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error getting random kana:", error);
    
    if (error instanceof Error && error.message === "User ID does not match authenticated session") {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse("Failed to get random kana", 500);
  }
});
