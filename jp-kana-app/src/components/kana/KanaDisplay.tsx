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
        {isLoading && !isDataInitialized ? (
          <span className="kana-loading-text">Loading...</span>
        ) : (
          <h1 className="kanaCharacter">
            {kanaType === 'hiragana' 
              ? currentKana.hiragana 
              : currentKana.katakana}
          </h1>
        )}
      </div>
    </div>
  );
};

export default KanaDisplay; 