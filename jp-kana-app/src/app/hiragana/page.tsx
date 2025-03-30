'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RandomKana from '../../components/showKana';

export default function HiraganaPage() {
  const router = useRouter();
  
  const handleNavigateBack = useCallback(() => {
    // Navigate to the home page
    router.push('/');
  }, [router]);
  
  return <RandomKana kanaType="hiragana" onNavigateBack={handleNavigateBack} />;
} 