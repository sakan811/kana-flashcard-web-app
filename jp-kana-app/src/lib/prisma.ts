import { PrismaClient } from '@prisma/client';

// This approach ensures the Prisma Client is only initialized once
// and properly handles both development and production environments

// Define our PrismaClient holder
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Create a safer export to prevent issues on the client
export function getPrismaClient(): PrismaClient {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Return a fake client that logs helpful error messages
    return new Proxy({} as PrismaClient, {
      get() {
        console.error(
          'PrismaClient cannot be used in the browser. Create a server API endpoint to handle database operations. See https://pris.ly/d/help/next-js-best-practices'
        );
        throw new Error(
          'PrismaClient cannot be used in the browser.'
        );
      },
    });
  }
  
  // We're on the server, so we can use PrismaClient
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }
  
  return globalForPrisma.prisma;
}

// Export a singleton instance
const prisma = getPrismaClient();

// Helper functions for user progress
export async function getUserProgressWithFlashcard(userId: string) {
  return await prisma.userProgress.findMany({
    where: { userId },
    include: { flashcard: true },
  });
}

export async function updateUserProgressRecord(userId: string, flashcardId: number, isCorrect: boolean) {
  return await prisma.userProgress.upsert({
    where: {
      userId_flashcardId: {
        userId,
        flashcardId,
      },
    },
    update: {
      correctCount: { increment: isCorrect ? 1 : 0 },
      incorrectCount: { increment: isCorrect ? 0 : 1 },
      lastPracticed: new Date(),
    },
    create: {
      userId,
      flashcardId,
      correctCount: isCorrect ? 1 : 0,
      incorrectCount: isCorrect ? 0 : 1,
      lastPracticed: new Date(),
    },
  });
}

export default prisma; 