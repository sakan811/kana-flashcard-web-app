import React from "react";
import { Character } from "@/types/kana";

interface KanaDisplayProps {
  currentKana: Character;
  isLoading: boolean;
  isDataInitialized: boolean;
  kanaType?: 'hiragana' | 'katakana';
}

/**
 * KanaDisplay component for displaying the current kana character
 * Features improved loading states and accessibility
 */
const KanaDisplay: React.FC<KanaDisplayProps> = ({
  currentKana,
  isLoading,
  isDataInitialized,
  kanaType,
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      {/* Kana display card */}
      <div 
        className="w-60 h-60 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 transition-all duration-300"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading && !isDataInitialized ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-t-blue-500 border-gray-200 animate-spin"></div>
            <span className="text-gray-500 dark:text-gray-400 text-xl mt-4">
              Loading...
            </span>
          </div>
        ) : (
          <>
            <h1 
              className="text-8xl font-bold text-gray-900 dark:text-white"
              aria-label={`${currentKana.character}, which is pronounced as ${currentKana.romaji}`}
            >
              {currentKana.character}
            </h1>
            <span className="sr-only">
              This is a {kanaType || currentKana.type} character pronounced as {currentKana.romaji}
            </span>
          </>
        )}
      </div>
      
      {/* Kana type indicator - only visible if provided */}
      {kanaType && !isLoading && (
        <div className="mt-4 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {kanaType === 'hiragana' ? 'Hiragana' : 'Katakana'}
        </div>
      )}
    </div>
  );
};

export default KanaDisplay;
