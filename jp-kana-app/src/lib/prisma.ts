import { PrismaClient } from "@prisma/client";
import type { Flashcard, UserKanaPerformance } from "@prisma/client";
// Import the KanaType enum to ensure proper typing
import { KanaType } from "@/types/kana";

// This approach follows recommended best practices for Next.js with Prisma
// to prevent multiple client instances during development

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper functions for user progress - optimized to reduce database queries
export async function getUserProgressWithFlashcard(userId: string): Promise<
  (UserKanaPerformance & {
    flashcard: Flashcard | null;
  })[]
> {
  try {
    // Get the user's performance data with related flashcards in a single query
    const performances = await prisma.userKanaPerformance.findMany({
      where: { userId },
      include: {
        // This assumes a proper relationship has been defined in the schema
        // If not, we'll fall back to the manual approach
        flashcard: true,
      },
    }).catch(() => null);
    
    if (performances) {
      // If the include works, return directly
      return performances as unknown as (UserKanaPerformance & { flashcard: Flashcard | null })[];
    }
    
    // Fallback to manual joining if relationship isn't defined
    const perfData = await prisma.userKanaPerformance.findMany({
      where: { userId },
    });
    
    // Get all kana in one query
    const kanaValues = perfData.map(p => p.kana);
    const flashcards = await prisma.flashcard.findMany({
      where: {
        kana: { in: kanaValues }
      }
    });
    
    // Create a lookup map for faster access
    const flashcardMap = new Map(
      flashcards.map(card => [card.kana, card])
    );
    
    // Join the data in memory
    return perfData.map(perf => ({
      ...perf,
      flashcard: flashcardMap.get(perf.kana) || null
    }));
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return [];
  }
}

export async function updateUserProgressRecord(
  userId: string,
  flashcardId: number,
  isCorrect: boolean,
): Promise<UserKanaPerformance> {
  try {
    // Fetch the flashcard once to avoid multiple database queries
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcard) {
      throw new Error(`Flashcard with ID ${flashcardId} not found`);
    }

    // Use flashcard data for the upsert
    return await prisma.userKanaPerformance.upsert({
      where: {
        userId_kana: {
          userId,
          kana: flashcard.kana,
        },
      },
      update: {
        correctCount: { increment: isCorrect ? 1 : 0 },
        totalCount: { increment: 1 },
        lastPracticed: new Date(),
      },
      create: {
        userId,
        kana: flashcard.kana,
        kanaType: flashcard.type as string,
        correctCount: isCorrect ? 1 : 0,
        totalCount: 1,
        lastPracticed: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating progress record:", error);
    throw error;
  }
}

export default prisma;
