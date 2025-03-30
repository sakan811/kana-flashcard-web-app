'use client';

import React, {useState, useEffect, useCallback, useRef, FormEvent, ChangeEvent} from 'react';
import {getRandomCharacter, getHiraganaList, getKatakanaList} from "./funcs/utilsFunc";
import KanaPerformanceTable from "./performanceTable/kanaPerformanceTable";
import {updateKanaWeight, submitAnswer} from "./funcs/showKanaFunc";
import { getKanaPerformance as fetchKanaPerformance, KanaPerformanceData } from '../lib/api-service';
import { DEFAULT_USER_ID } from '../constants';
import { Character } from '../types';

// Props interface for Next.js compatibility
interface KanaProps {
  kanaType: 'hiragana' | 'katakana';
  onNavigateBack: () => void;
}

const RandomKana: React.FC<KanaProps> = ({ kanaType, onNavigateBack }) => {
  // Choose the correct kana set based on the kanaType parameter
  const initialKanaCharacters: Character[] = kanaType === 'hiragana' ? getHiraganaList() : getKatakanaList();
  const isNavigatingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tableColumns = [
    { key: kanaType === 'hiragana' ? 'hiragana' : 'katakana', header: kanaType === 'hiragana' ? 'Hiragana' : 'Katakana' },
    { key: 'romanji', header: 'Romanji' },
    { key: 'correctCount', header: 'Correct Answers' },
    { key: 'totalCount', header: 'Total Answers' },
    { key: 'accuracy', header: 'Accuracy (%)' },
  ];

  const [currentKana, setCurrentKana] = useState<Character>(initialKanaCharacters[0]);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<{ correct: string; incorrect: string; error: string }>({ 
    correct: '', 
    incorrect: '',
    error: '' 
  });
  const [performanceData, setPerformanceData] = useState<KanaPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const tableTitle = `${kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Performance`;

  const getRandomKana = useCallback((kanaData: Character[]): Character => {
    return getRandomCharacter(kanaData) as Character;
  }, []);

  // Function to fetch and update kana with weights
  const fetchAndUpdateKana = useCallback(async () => {
    if (isLoading || isNavigatingRef.current) return; // Prevent operations during navigation
    
    setIsLoading(true);
    try {
      const updatedCharWeight = await updateKanaWeight(initialKanaCharacters, kanaType);
      setCurrentKana(getRandomKana(updatedCharWeight));
      setHasError(false);
    } catch (error) {
      console.error('Error updating kana:', error);
      setMessage(prev => ({ ...prev, error: 'Database connection error. Please check your configuration.' }));
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [getRandomKana, initialKanaCharacters, kanaType, isLoading]);

  // Function to get kana performance data
  const getKanaPerformance = useCallback(async () => {
    if (isLoading || isNavigatingRef.current) return; // Prevent operations during navigation
    
    const validKanaTypes = ['hiragana', 'katakana'];
    if (validKanaTypes.includes(kanaType)) {
      setIsLoading(true);
      try {
        const data = await fetchKanaPerformance(DEFAULT_USER_ID, kanaType as 'hiragana' | 'katakana');
        // Only update state if component is still mounted and not navigating away
        if (!isNavigatingRef.current) {
          setPerformanceData(data);
          setHasError(false);
        }
      } catch (error) {
        console.error(`Error fetching ${kanaType} performance:`, error);
        if (!isNavigatingRef.current) {
          setPerformanceData([]);
          setMessage(prev => ({ ...prev, error: 'Database connection error. Please check your configuration.' }));
          setHasError(true);
        }
      } finally {
        if (!isNavigatingRef.current) {
          setIsLoading(false);
        }
      }
    } else {
      console.error('Invalid kana type');
      if (!isNavigatingRef.current) {
        setPerformanceData([]);
      }
    }
  }, [kanaType, isLoading]);

  // Initial data loading only once on component mount
  useEffect(() => {
    let isMounted = true;
    isNavigatingRef.current = false;
    
    const loadInitialData = async () => {
      if (!isMounted) return;
      
      // Load initial data with a slight delay to improve first render performance
      const timeoutId = setTimeout(async () => {
        if (isMounted && !isNavigatingRef.current) {
          await fetchAndUpdateKana();
          await getKanaPerformance();
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    };
    
    const loadPromise = loadInitialData();
    
    return () => {
      isMounted = false;
      isNavigatingRef.current = true;
      // Clean up any pending promises
      loadPromise.then(cleanup => cleanup && cleanup());
    };
  }, [kanaType, fetchAndUpdateKana, getKanaPerformance]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (isLoading || isNavigatingRef.current || hasError) return; // Prevent submitting during loading, navigation or if there's an error
    
    const isCorrect = inputValue.toLowerCase() === currentKana.romanji;

    setIsLoading(true);
    try {
      await submitAnswer(kanaType, inputValue, currentKana, isCorrect);

      if (!isNavigatingRef.current) {
        setMessage({
            correct: isCorrect ? 'Correct!' : '',
            incorrect: !isCorrect ? `Incorrect. It is <b>${currentKana.romanji}</b>` : '',
            error: ''
        });

        // Batch these operations to prevent multiple re-renders
        await Promise.all([
          getKanaPerformance(),
          fetchAndUpdateKana(),
        ]);

        setInputValue('');
        
        // Focus the input element after submission
        if (inputRef.current) {
          inputRef.current.focus();
        }

        const messageTimeoutId = setTimeout(() => {
          if (!isNavigatingRef.current) {
            setMessage(prev => ({ ...prev, correct: '', incorrect: '' }));
          }
        }, 1000);
        
        // Clean up the timeout if component unmounts
        return () => clearTimeout(messageTimeoutId);
      }
    } catch (error) {
      console.error('Error:', error);
      if (!isNavigatingRef.current) {
        setMessage({ 
          correct: '', 
          incorrect: '', 
          error: 'Database connection error. Please check your configuration.'
        });
        setHasError(true);
      }
    } finally {
      if (!isNavigatingRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleBackClick = useCallback(() => {
    // Set navigating flag to prevent further state updates
    isNavigatingRef.current = true;
    
    // Use requestAnimationFrame to avoid forcing layout during click event
    requestAnimationFrame(() => {
      onNavigateBack();
    });
  }, [onNavigateBack]);

  return (
    <div className="kana-container">
      <div className="titleContainer">
        <h1 className="title">{kanaType === 'hiragana' ? 'Hiragana Flashcard' : 'Katakana Flashcard'}</h1>
        <button 
          className="backButton" 
          onClick={handleBackClick}
          // Disable button during navigation to prevent multiple clicks
          disabled={isNavigatingRef.current}
        >
          Back
        </button>
      </div>
      
      {message.error && (
        <div className="error-message">
          <strong className="error-message-title">Error:</strong>
          <span className="error-message-content"> {message.error}</span>
        </div>
      )}
      
      <div className="kanaBox">
        <div className="kanaCard">
          <h1 className="kanaCharacter">{kanaType === 'hiragana' ? currentKana.hiragana : currentKana.katakana}</h1>
        </div>
      </div>
      
      <form id="romanjiForm" onSubmit={handleSubmit}>
        <label htmlFor="romanjiInput" className="inputTitle">Enter Romanji:</label>
        <input
          type="text"
          id="romanjiInput"
          name="romanjiInput"
          placeholder="Type here..."
          value={inputValue}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          disabled={isLoading || isNavigatingRef.current || hasError}
          ref={inputRef}
        />
        <button 
          type="submit" 
          disabled={isLoading || isNavigatingRef.current || hasError}
        >
          Submit
        </button>
      </form>
      
      {message.correct && <p className="correctMsg">{message.correct}</p>}
      {message.incorrect && <p className="incorrectMsg" dangerouslySetInnerHTML={{ __html: message.incorrect }}></p>}
      
      <div className="mt-8">
        <KanaPerformanceTable
          performanceData={performanceData}
          columns={tableColumns}
          title={tableTitle}
          kanaType={kanaType}
        />
        {isLoading && <p className="loading-text">Loading...</p>}
      </div>
    </div>
  );
};

export default RandomKana;
