import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { Character } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, kanaType, characters } = body;
    
    if (!userId || !kanaType || !characters || !Array.isArray(characters)) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get all performance data for this user and kana type
    const performances = await prisma.userKanaPerformance.findMany({
      where: {
        userId: userId,
        kanaType: kanaType,
      },
    });
    
    // Convert to a more usable format with accuracy calculated
    const performanceData = performances.map((perf) => ({
      kana: perf.kana,
      kanaType: perf.kanaType,
      correctCount: perf.correctCount,
      totalCount: perf.totalCount,
      accuracy: perf.totalCount > 0 ? (perf.correctCount / perf.totalCount) * 100 : 0,
    }));
    
    // Calculate weights for each character
    const charactersWithWeights = characters.map((char: Character) => {
      const kanaValue = kanaType === 'hiragana' ? char.hiragana : char.katakana;
      const performance = performanceData.find(p => p.kana === kanaValue);
      
      if (performance) {
        const accuracy = performance.accuracy || 0;
        // Weight is inversely proportional to accuracy - less accurate characters appear more often
        const weight = 1 + ((100 - accuracy) / 25);
        return { ...char, weight };
      }
      
      return char;
    });
    
    return NextResponse.json(charactersWithWeights);
  } catch (error) {
    console.error('Error getting kana weights:', error);
    return NextResponse.json(
      { error: 'Failed to calculate kana weights' },
      { status: 500 }
    );
  }
} 