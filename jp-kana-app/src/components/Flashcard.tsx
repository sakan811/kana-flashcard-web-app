import React, { useState } from 'react';

interface FlashcardProps {
  character: string;
  romaji: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ character, romaji }) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div 
      className={`flashcard ${flipped ? 'flipped' : ''}`} 
      onClick={handleClick}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="character">{character}</span>
        </div>
        <div className="flashcard-back">
          <span className="romanji">{romaji}</span>
        </div>
      </div>
    </div>
  );
};

export default Flashcard; 