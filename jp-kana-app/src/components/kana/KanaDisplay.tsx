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
    <div className="flex justify-center my-8">
      <div className="w-60 h-60 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
        {isLoading && !isDataInitialized ? (
          <span className="text-gray-500 dark:text-gray-400 text-xl animate-pulse">Loading...</span>
        ) : (
          <h1 className="text-8xl font-bold text-gray-900 dark:text-white">
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