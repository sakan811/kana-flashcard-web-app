'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RandomKana from '../../components/showKana';

export default function HiraganaPage() {
  const router = useRouter();
  
  const handleNavigateBack = () => {
    router.push('/');
  };
  
  return <RandomKana kanaType="hiragana" onNavigateBack={handleNavigateBack} />;
} 