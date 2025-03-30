import prisma from './prisma';
import { Character, KanaPerformanceData } from '../types';

// Type for the UserKanaPerformance model
interface UserKanaPerformance {
  id: number;
  userId: string;
  kana: string;
  kanaType: string;
  correctCount: number;
  totalCount: number;
  lastPracticed: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all flashcards, optionally filtered by type
 */
export async function getFlashcards(type?: 'hiragana' | 'katakana') {
  try {
    return await prisma.flashcard.findMany({
      where: type ? { type: type } : undefined,
    });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }
}

/**
 * Get all progress for a specific user
 */
export async function getUserProgress(userId: string) {
  try {
    return await prisma.userProgress.findMany({
      where: { userId },
      include: { flashcard: true },
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
}

/**
 * Update user progress for a specific flashcard
 */
export async function updateUserProgress(userId: string, flashcardId: number, isCorrect: boolean) {
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
    console.error('Error updating user progress:', error);
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
  kanaType: 'hiragana' | 'katakana' | undefined,
  isCorrect: boolean
): Promise<void> {
  try {
    // Default to hiragana if kanaType is undefined
    const effectiveKanaType: 'hiragana' | 'katakana' = kanaType || 'hiragana';
    
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
    console.error('Error recording kana performance:', error);
  }
}

/**
 * Get performance data for all kana of a specific type for a user
 */
export async function getKanaPerformance(
  userId: string, 
  kanaType: 'hiragana' | 'katakana'
): Promise<KanaPerformanceData[]> {
  try {
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: userId,
        kanaType: kanaType,
      },
    });
    
    return performances.map((perf: UserKanaPerformance) => ({
      kana: perf.kana,
      kanaType: perf.kanaType,
      correctCount: perf.correctCount,
      totalCount: perf.totalCount,
      accuracy: perf.totalCount > 0 ? (perf.correctCount / perf.totalCount) * 100 : 0,
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
  kanaType: 'hiragana' | 'katakana'
): Promise<Character[]> {
  try {
    const performanceData = await getKanaPerformance(userId, kanaType);
    
    return characters.map(char => {
      const charPerformance = performanceData.find(
        item => item.kana === (kanaType === 'hiragana' ? char.hiragana : char.katakana)
      );
      
      if (charPerformance) {
        const accuracy = charPerformance.accuracy || 0;
        // Weight is inversely proportional to accuracy - less accurate characters appear more often
        const newWeight = 1 + ((100 - accuracy) / 25);
        return { ...char, weight: newWeight };
      }
      
      return char;
    });
  } catch (error) {
    console.error('Error getting kana with weights:', error);
    return characters;
  }
} 