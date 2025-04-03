'use client';

import { useState, useEffect } from 'react';
import { useFlashcard } from './FlashcardProvider';

export default function Flashcard() {
  const { currentKana, loadingKana, submitAnswer, result, nextCard } = useFlashcard();
  const [answer, setAnswer] = useState('');
  
  // Handle Enter key when result is shown
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && result) {
        nextCard();
        setAnswer('');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [result, nextCard]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) {
      submitAnswer(answer);
    } else {
      nextCard();
      setAnswer('');
    }
  };
  
  if (loadingKana) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!currentKana) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-700">No flashcards available.</p>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-8xl font-bold text-gray-800">{currentKana.character}</h2>
        </div>
        
        {result && (
          <div className={`mb-6 rounded-md p-3 text-center ${
            result === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-lg font-semibold">
              {result === 'correct' ? 'Correct!' : 'Incorrect!'}
            </p>
            <p>The correct answer is: <strong>{currentKana.romaji}</strong></p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type romaji equivalent..."
            disabled={!!result}
            className="mb-4 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            {result ? 'Next Card' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}