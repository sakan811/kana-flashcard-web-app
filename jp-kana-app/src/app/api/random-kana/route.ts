import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { Character, KanaType } from "@/types/kana";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Extract parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const kanaTypeParam = searchParams.get("kanaType");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    // Validate kanaType
    if (kanaTypeParam !== "hiragana" && kanaTypeParam !== "katakana") {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid kanaType: must be "hiragana" or "katakana"',
        },
        { status: 400 },
      );
    }

    // Fetch all flashcards of the specified type
    const flashcards = await prisma.flashcard.findMany({
      where: { type: kanaTypeParam },
    });

    if (flashcards.length === 0) {
      return NextResponse.json(
        { success: false, error: "No flashcards found for the specified type" },
        { status: 404 },
      );
    }

    // Get user performance data for all kana of this type
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: userId,
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

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error getting random kana:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get random kana" },
      { status: 500 },
    );
  }
}
