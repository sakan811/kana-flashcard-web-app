'use client';

import React, { useRef } from 'react';
import KanaPerformanceTable from './performanceTable/kanaPerformanceTable';
import { useKanaFlashcard } from '../hooks/useKanaFlashcard';
import KanaDisplay from './kana/KanaDisplay';
import KanaInput from './kana/KanaInput';
import MessageDisplay from './kana/MessageDisplay';
import BackButton from './ui/BackButton';

interface KanaProps {
  kanaType: 'hiragana' | 'katakana';
  onNavigateBack: () => void;
}

const RandomKana: React.FC<KanaProps> = ({ kanaType, onNavigateBack }) => {
  const isNavigatingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    currentKana,
    performanceData,
    inputValue,
    setInputValue,
    isLoading,
    hasError,
    message,
    isDataInitialized,
    handleSubmitAnswer,
    handleRetry,
    clearErrorMessage
  } = useKanaFlashcard(kanaType, isNavigatingRef);

  const tableColumns = [
    { key: kanaType === 'hiragana' ? 'hiragana' : 'katakana', header: kanaType === 'hiragana' ? 'Hiragana' : 'Katakana' },
    { key: 'romanji', header: 'Romanji' },
    { key: 'correctCount', header: 'Correct Answers' },
    { key: 'totalCount', header: 'Total Answers' },
    { key: 'accuracy', header: 'Accuracy (%)' },
  ];
  
  const tableTitle = `${kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Performance`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSubmitAnswer(inputValue);
    setInputValue('');
    
    // Focus the input element after submission with a small delay
    // to allow the DOM to update first
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleBackClick = () => {
    // Set navigating flag to prevent further state updates
    isNavigatingRef.current = true;
    
    // Use requestAnimationFrame to avoid forcing layout during click event
    requestAnimationFrame(() => {
      onNavigateBack();
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {kanaType === 'hiragana' ? 'Hiragana Flashcard' : 'Katakana Flashcard'}
        </h1>
        <BackButton onClick={handleBackClick} disabled={isNavigatingRef.current} />
      </div>
      
      <MessageDisplay 
        error={message.error} 
        hasError={hasError} 
        onRetry={() => {
          clearErrorMessage();
          handleRetry();
        }} 
      />
      
      <KanaDisplay 
        kanaType={kanaType} 
        currentKana={currentKana} 
        isLoading={isLoading} 
        isDataInitialized={isDataInitialized} 
      />
      
      <KanaInput 
        inputValue={inputValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        disabled={isLoading || isNavigatingRef.current || hasError}
        inputRef={inputRef}
      />
      
      {message.correct && <p className="mt-4 text-green-600 dark:text-green-400 font-medium text-lg">{message.correct}</p>}
      {message.incorrect && <p className="mt-4 text-red-600 dark:text-red-400 font-medium text-lg" dangerouslySetInnerHTML={{ __html: message.incorrect }}></p>}
      
      <div className="mt-8">
        <KanaPerformanceTable
          performanceData={performanceData}
          columns={tableColumns}
          title={tableTitle}
          kanaType={kanaType}
        />
      </div>
    </div>
  );
};

export default RandomKana;
