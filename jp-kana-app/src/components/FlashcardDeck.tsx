import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import { Character, getHiraganaList, getKatakanaList } from './funcs/utilsFunc';

interface FlashcardDeckProps {
  type?: 'hiragana' | 'katakana' | 'all';
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ type = 'all' }) => {
  const [kanaItems, setKanaItems] = useState<Character[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the existing utility functions to get kana data
    const loadKana = () => {
      let items: Character[] = [];
      
      if (type === 'hiragana' || type === 'all') {
        items = [...items, ...getHiraganaList()];
      }
      
      if (type === 'katakana' || type === 'all') {
        items = [...items, ...getKatakanaList()];
      }
      
      setKanaItems(items);
      setLoading(false);
    };

    loadKana();
  }, [type]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex < kanaItems.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (kanaItems.length === 0) {
    return <div>No kana items found.</div>;
  }

  const currentKana = kanaItems[currentIndex];
  const character = type === 'katakana' ? currentKana.katakana : currentKana.hiragana;

  return (
    <div className="flashcard-deck">
      <div className="flashcard-container">
        <Flashcard 
          character={character || ''} 
          romaji={currentKana.romanji} 
        />
      </div>
      <div className="controls">
        <button 
          className="btn btn-primary" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <span className="counter">
          {currentIndex + 1} / {kanaItems.length}
        </span>
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={currentIndex === kanaItems.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck; 