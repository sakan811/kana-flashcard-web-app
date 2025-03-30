import { NextRequest, NextResponse } from 'next/server';
import prisma, { getUserProgressWithFlashcard } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'current-user';
  
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get user progress with flashcard data
    const progressData = await getUserProgressWithFlashcard(userId);
    
    // Transform data for easier consumption by the frontend
    const formattedProgress = progressData.map((progress) => ({
      flashcardId: progress.flashcardId,
      kana: progress.flashcard.kana,
      romaji: progress.flashcard.romaji,
      type: progress.flashcard.type,
      correctCount: progress.correctCount,
      incorrectCount: progress.incorrectCount,
      totalCount: progress.correctCount + progress.incorrectCount,
      accuracy: progress.correctCount + progress.incorrectCount > 0 
        ? (progress.correctCount / (progress.correctCount + progress.incorrectCount)) * 100 
        : 0,
      lastPracticed: progress.lastPracticed,
    }));
    
    return NextResponse.json(formattedProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Database connection error. Please check your database configuration and environment variables.' },
      { status: 500 }
    );
  }
} 