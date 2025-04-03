import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { kanaId, isCorrect } = await request.json();
    
    // Find or create UserAccuracy record
    const userAccuracy = await prisma.userAccuracy.upsert({
      where: {
        user_id_kana_id: {
          user_id: session.user.id,
          kana_id: kanaId,
        },
      },
      update: {
        attempts: { increment: 1 },
        correct_attempts: isCorrect ? { increment: 1 } : undefined,
      },
      create: {
        user_id: session.user.id,
        kana_id: kanaId,
        attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
      },
    });
    
    // Calculate and update accuracy
    const accuracy = userAccuracy.correct_attempts / userAccuracy.attempts;
    
    await prisma.userAccuracy.update({
      where: { id: userAccuracy.id },
      data: { accuracy },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}