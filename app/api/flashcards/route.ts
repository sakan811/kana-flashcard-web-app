import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all kana
    const allKana = await prisma.kana.findMany();
    
    // Get user accuracy data
    const userAccuracies = await prisma.userAccuracy.findMany({
      where: {
        user_id: session.user.id,
      },
    });
    
    // Map kana with user accuracy data
    const kanaWithAccuracy = allKana.map(kana => {
      const accuracyRecord = userAccuracies.find(ua => ua.kana_id === kana.id);
      return {
        ...kana,
        accuracy: accuracyRecord?.accuracy || 0,
      };
    });
    
    return NextResponse.json(kanaWithAccuracy);
  } catch (error) {
    console.error('Error fetching kana data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}