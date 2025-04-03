'use client';

import { useState, useEffect, useRef } from 'react';
import { useFlashcard } from './FlashcardProvider';

export default function Flashcard() {
  const { currentKana, loadingKana, submitAnswer, result, nextCard } = useFlashcard();
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Focus input when component mounts, when card changes, or after result is cleared
  useEffect(() => {
    if (inputRef.current && !loadingKana && currentKana && !result && !isProcessing) {
      inputRef.current.focus();
    }
  }, [currentKana, loadingKana, result, isProcessing]);

  // Handle Enter key when result is shown
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && result && !isProcessing) {
        setIsProcessing(true);
        nextCard();
        setAnswer('');
        // Allow a brief delay before enabling the next action
        setTimeout(() => setIsProcessing(false), 500);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [result, nextCard, isProcessing]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    if (!result) {
      submitAnswer(answer);
    } else {
      nextCard();
      setAnswer('');
    }
    
    // Allow a brief delay before enabling the next action
    setTimeout(() => setIsProcessing(false), 500);
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
          {!result ? (
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type romaji equivalent..."
              className="mb-4 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isProcessing}
              autoFocus
            />
          ) : (
            <div></div> // Empty space placeholder when result is showing
          )}
          <button
            type="submit"
            disabled={isProcessing}
            className={`rounded-md px-4 py-2 font-medium text-white transition ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {result ? (isProcessing ? 'Loading...' : 'Next Card') : (isProcessing ? 'Submitting...' : 'Submit')}
          </button>
        </form>
      </div>
    </div>
  );
}