'use client';

import { useSession } from 'next-auth/react';
import { FlashcardProvider } from './FlashcardProvider';
import Flashcard from './Flashcard';
import Header from './Header';
import Dashboard from './Dashboard';
import { useState } from 'react';

export default function FlashcardApp() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'flashcards' | 'dashboard'>('flashcards');
  
  if (!session) {
    return null;
  }
  
  return (
    <FlashcardProvider>
      <div className="min-h-screen bg-slate-50">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="container mx-auto max-w-4xl px-4 py-8">
          {activeTab === 'flashcards' ? (
            <Flashcard />
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </FlashcardProvider>
  );
}