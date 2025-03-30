import React, { useState, useCallback, useEffect } from 'react';
import { Character, getRandomCharacter } from '../lib/utils';
import { updateKanaWeight, submitAnswer } from '../lib/flashcard-service';
import { getKanaPerformance as fetchKanaPerformance, KanaPerformanceData } from '../lib/api-service';
import { DEFAULT_USER_ID } from '../constants';

interface FlashcardHookProps {
  initialCharacters: Character[];
  kanaType?: 'hiragana' | 'katakana';
}

export const useFlashcards = ({ initialCharacters, kanaType }: FlashcardHookProps) => {
  const [currentKana, setCurrentKana] = useState<Character>(initialCharacters[0]);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<{ correct: string; incorrect: string }>({ correct: '', incorrect: '' });
  const [performanceData, setPerformanceData] = useState<KanaPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getRandomKana = useCallback((kanaData: Character[]): Character => {
    return getRandomCharacter(kanaData) as Character;
  }, []);

  const fetchAndUpdateKana = useCallback(async () => {
    setIsLoading(true);
    try {
      if (kanaType && (kanaType === 'hiragana' || kanaType === 'katakana')) {
        const updatedCharWeight = await updateKanaWeight(initialCharacters, kanaType);
        setCurrentKana(getRandomKana(updatedCharWeight));
      } else {
        console.error('Invalid kana type');
        setCurrentKana(getRandomKana(initialCharacters));
      }
    } catch (error) {
      console.error('Error updating kana weights:', error);
      setCurrentKana(getRandomKana(initialCharacters));
    } finally {
      setIsLoading(false);
    }
  }, [getRandomKana, initialCharacters, kanaType]);

  const getKanaPerformance = useCallback(async () => {
    if (!kanaType || (kanaType !== 'hiragana' && kanaType !== 'katakana')) {
      console.error('Invalid kana type');
      setPerformanceData([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await fetchKanaPerformance(DEFAULT_USER_ID, kanaType);
      setPerformanceData(data);
    } catch (error) {
      console.error(`Error fetching ${kanaType} performance:`, error);
      setPerformanceData([]);
    } finally {
      setIsLoading(false);
    }
  }, [kanaType]);

  useEffect(() => {
    fetchAndUpdateKana();
    getKanaPerformance();
  }, [fetchAndUpdateKana, getKanaPerformance]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isCorrect = inputValue.toLowerCase() === currentKana.romanji;

    setIsLoading(true);
    try {
      await submitAnswer(kanaType, inputValue, currentKana, isCorrect);

      setMessage({
        correct: isCorrect ? 'Correct!' : '',
        incorrect: !isCorrect ? `Incorrect. It is ${currentKana.romanji}` : '',
      });

      await Promise.all([
        getKanaPerformance(),
        fetchAndUpdateKana(),
      ]);

      setInputValue('');

      setTimeout(() => setMessage({ correct: '', incorrect: '' }), 1000);
    } catch (error) {
      console.error('Error:', error);
      setMessage({ correct: '', incorrect: 'Submission failed. Please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentKana,
    inputValue,
    message,
    performanceData,
    isLoading,
    setInputValue,
    handleSubmit,
  };
}; 