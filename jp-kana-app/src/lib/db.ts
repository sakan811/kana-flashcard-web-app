import prisma from "./prisma";
import {
  Character,
  KanaType,
  KanaPerformanceData,
  UserKanaPerformance,
} from "@/types/kana";

/**
 * Get all flashcards, optionally filtered by type
 */
export async function getFlashcards(
  type?: KanaType,
): Promise<Character[]> {
  try {
    const flashcards = await prisma.flashcard.findMany({
      where: type ? { type: type } : undefined,
    });

    return flashcards.map((flashcard) => ({
      ...flashcard,
      romaji: flashcard.romaji,
      type: flashcard.type as KanaType,
      weight: 1, // Default weight
    }));
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return [];
  }
}

/**
 * Get all progress for a specific user
 */
export async function getUserProgress(
  userId: string,
): Promise<UserKanaPerformance[]> {
  try {
    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: { flashcard: true },
    });

    return progress.map((p) => ({
      id: p.id,
      userId: p.userId,
      kana: p.flashcard.kana,
      kanaType: p.flashcard.type as KanaType,
      correctCount: p.correctCount,
      totalCount: p.correctCount + p.incorrectCount,
      lastPracticed: p.lastPracticed,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return [];
  }
}

/**
 * Update user progress for a specific flashcard
 */
export async function updateUserProgress(
  userId: string,
  flashcardId: number,
  isCorrect: boolean,
): Promise<void> {
  try {
    // Upsert (create or update) user progress
    await prisma.userProgress.upsert({
      where: {
        userId_flashcardId: {
          userId: userId,
          flashcardId: flashcardId,
        },
      },
      update: {
        correctCount: { increment: isCorrect ? 1 : 0 },
        incorrectCount: { increment: isCorrect ? 0 : 1 },
        lastPracticed: new Date(),
      },
      create: {
        userId: userId,
        flashcardId: flashcardId,
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: isCorrect ? 0 : 1,
        lastPracticed: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating user progress:", error);
  }
}

/**
 * Record user performance for a kana character
 * @param userId - The ID of the user
 * @param kana - The kana character
 * @param kanaType - The type of kana (hiragana or katakana)
 * @param isCorrect - Whether the answer was correct
 */
export async function recordKanaPerformance(
  userId: string,
  kana: string,
  kanaType: KanaType | undefined,
  isCorrect: boolean,
): Promise<void> {
  try {
    // Default to hiragana if kanaType is undefined
    const effectiveKanaType: KanaType = kanaType || KanaType.hiragana;

    await prisma.userKanaPerformance.upsert({
      where: {
        userId_kana: {
          userId: userId,
          kana: kana,
        },
      },
      update: {
        correctCount: { increment: isCorrect ? 1 : 0 },
        totalCount: { increment: 1 },
        lastPracticed: new Date(),
      },
      create: {
        userId: userId,
        kana: kana,
        kanaType: effectiveKanaType,
        correctCount: isCorrect ? 1 : 0,
        totalCount: 1,
        lastPracticed: new Date(),
      },
    });
  } catch (error) {
    console.error("Error recording kana performance:", error);
  }
}

/**
 * Get performance data for all kana of a specific type for a user
 */
export async function getKanaPerformance(
  userId: string,
  kanaType: KanaType,
): Promise<KanaPerformanceData[]> {
  try {
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: userId,
        kanaType: kanaType,
      },
    });

    return performances.map((perf) => ({
      id: perf.id,
      userId: perf.userId,
      kana: perf.kana,
      kanaType: perf.kanaType as KanaType,
      correctCount: perf.correctCount,
      totalCount: perf.totalCount,
      accuracy:
        perf.totalCount > 0 ? (perf.correctCount / perf.totalCount) * 100 : 0,
      percentage:
        perf.totalCount > 0 ? (perf.correctCount / perf.totalCount) * 100 : 0,
      lastPracticed: perf.lastPracticed,
      createdAt: perf.createdAt,
      updatedAt: perf.updatedAt,
    }));
  } catch (error) {
    console.error(`Error getting ${kanaType} performance:`, error);
    return [];
  }
}

/**
 * Update character weights based on user performance
 */
export async function getKanaWithWeights(
  characters: Character[],
  userId: string,
  kanaType: KanaType,
): Promise<Character[]> {
  try {
    const performanceData = await getKanaPerformance(userId, kanaType);

    return characters.map((char) => {
      const charPerformance = performanceData.find(
        (item) => item.kana === char.kana,
      );

      if (charPerformance) {
        const accuracy = charPerformance.accuracy || 0;
        // Weight is inversely proportional to accuracy - less accurate characters appear more often
        const newWeight = 1 + (100 - accuracy) / 25;
        return { ...char, weight: newWeight };
      }

      return char;
    });
  } catch (error) {
    console.error("Error getting kana with weights:", error);
    return characters;
  }
}
