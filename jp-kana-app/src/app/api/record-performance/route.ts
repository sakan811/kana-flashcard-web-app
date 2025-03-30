import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, kana, kanaType, isCorrect } = body;
    
    if (!userId || !kana || !kanaType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
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
        kanaType: kanaType,
        correctCount: isCorrect ? 1 : 0,
        totalCount: 1,
        lastPracticed: new Date(),
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording kana performance:', error);
    return NextResponse.json(
      { error: 'Database connection error. Please check your database configuration and environment variables.' },
      { status: 500 }
    );
  }
} 