import React from 'react';
import { Character } from '../../types';

interface KanaDisplayProps {
  kanaType: 'hiragana' | 'katakana';
  currentKana: Character;
  isLoading: boolean;
  isDataInitialized: boolean;
}

const KanaDisplay: React.FC<KanaDisplayProps> = ({
  kanaType,
  currentKana,
  isLoading,
  isDataInitialized
}) => {
  return (
    <div className="kanaBox">
      <div className="kanaCard">
        <h1 className="kanaCharacter">
          {isLoading && !isDataInitialized 
            ? "Loading..." 
            : kanaType === 'hiragana' 
              ? currentKana.hiragana 
              : currentKana.katakana}
        </h1>
      </div>
    </div>
  );
};

export default KanaDisplay; 