'use client';

import React, {useState, useEffect, useCallback, useRef, FormEvent, ChangeEvent} from 'react';
import KanaPerformanceTable from "./performanceTable/kanaPerformanceTable";
import {submitAnswer} from "./funcs/showKanaFunc";
import { 
  getKanaPerformance as fetchKanaPerformance, 
  KanaPerformanceData,
  getRandomKana as fetchRandomKana
} from '../lib/api-service';
import { DEFAULT_USER_ID } from '../constants';
import { Character } from '../types';

// Props interface for Next.js compatibility
interface KanaProps {
  kanaType: 'hiragana' | 'katakana';
  onNavigateBack: () => void;
}

const RandomKana: React.FC<KanaProps> = ({ kanaType, onNavigateBack }) => {
  const isNavigatingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialLoadRef = useRef(true);
  const previousKanaRef = useRef<string[]>([]);

  const tableColumns = [
    { key: kanaType === 'hiragana' ? 'hiragana' : 'katakana', header: kanaType === 'hiragana' ? 'Hiragana' : 'Katakana' },
    { key: 'romanji', header: 'Romanji' },
    { key: 'correctCount', header: 'Correct Answers' },
    { key: 'totalCount', header: 'Total Answers' },
    { key: 'accuracy', header: 'Accuracy (%)' },
  ];

  // Initialize with a default empty character
  const defaultCharacter: Character = { romanji: "", weight: 1 };
  const [currentKana, setCurrentKana] = useState<Character>(defaultCharacter);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<{ correct: string; incorrect: string; error: string }>({ 
    correct: '', 
    incorrect: '',
    error: '' 
  });
  const [performanceData, setPerformanceData] = useState<KanaPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isDataInitialized, setIsDataInitialized] = useState<boolean>(false);

  const tableTitle = `${kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Performance`;

  // Function to check if a kana was recently shown
  const isRecentlyShown = useCallback((kana: string): boolean => {
    return previousKanaRef.current.includes(kana);
  }, []);

  // Function to update the history of shown kana
  const updateKanaHistory = useCallback((kana: string) => {
    if (!kana) return;
    
    const maxHistorySize = 5; // Keep track of last 5 kana to avoid repetition
    previousKanaRef.current = [
      kana,
      ...previousKanaRef.current.slice(0, maxHistorySize - 1)
    ];
  }, []);

  // Function to fetch a random kana directly from the database
  const getRandomKana = useCallback(async (): Promise<Character> => {
    try {
      // Try up to 3 times to get a kana that hasn't been shown recently
      for (let attempt = 0; attempt < 3; attempt++) {
        const randomKana = await fetchRandomKana(DEFAULT_USER_ID, kanaType);
        const kanaValue = kanaType === 'hiragana' ? randomKana.hiragana : randomKana.katakana;
        
        // If this kana hasn't been shown recently, or we're on our last attempt, use it
        if (!kanaValue || !isRecentlyShown(kanaValue) || attempt === 2) {
          if (kanaValue) {
            updateKanaHistory(kanaValue);
          }
          return randomKana;
        }
      }
      
      // Fallback - should never reach here but just in case
      return await fetchRandomKana(DEFAULT_USER_ID, kanaType);
    } catch (error) {
      console.error('Error fetching random kana:', error);
      
      // Fallback to a basic character if API fails
      return {
        hiragana: kanaType === 'hiragana' ? 'あ' : undefined,
        katakana: kanaType === 'katakana' ? 'ア' : undefined,
        romanji: 'a',
        weight: 1
      };
    }
  }, [kanaType, isRecentlyShown, updateKanaHistory]);

  // Function to get kana performance data
  const getKanaPerformance = useCallback(async () => {
    if (isNavigatingRef.current) return; // Prevent operations during navigation
    
    const validKanaTypes = ['hiragana', 'katakana'];
    if (!validKanaTypes.includes(kanaType)) {
      console.error('Invalid kana type');
      if (!isNavigatingRef.current) {
        setPerformanceData([]);
      }
      return;
    }
    
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
    }
  }, [kanaType]);

  // Function to fetch next kana
  const fetchNextKana = useCallback(async () => {
    if (isNavigatingRef.current) return; // Prevent operations during navigation
    
    setIsLoading(true);
    let retryCount = 0;
    const MAX_RETRIES = 3;
    
    const attemptFetch = async (): Promise<void> => {
      try {
        const randomKana = await getRandomKana();
        if (!isNavigatingRef.current) {
          setCurrentKana(randomKana);
          setHasError(false);
        }
      } catch (error) {
        console.error('Error fetching next kana:', error);
        
        if (retryCount < MAX_RETRIES && !isNavigatingRef.current) {
          retryCount++;
          console.log(`Retrying kana fetch (${retryCount}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
          return attemptFetch();
        }
        
        if (!isNavigatingRef.current) {
          setMessage(prev => ({ 
            ...prev, 
            error: 'Error fetching kana. Please check your connection and try again.' 
          }));
          setHasError(true);
          
          // Set a minimal fallback character as last resort
          const fallbackChar: Character = { 
            hiragana: kanaType === 'hiragana' ? 'あ' : undefined,
            katakana: kanaType === 'katakana' ? 'ア' : undefined,
            romanji: 'a',
            weight: 1
          };
          setCurrentKana(fallbackChar);
        }
      } finally {
        if (!isNavigatingRef.current) {
          setIsLoading(false);
        }
      }
    };
    
    await attemptFetch();
  }, [getRandomKana, kanaType]);

  // Initial data loading only once on component mount
  useEffect(() => {
    if (!isInitialLoadRef.current) return;
    
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    isNavigatingRef.current = false;
    isInitialLoadRef.current = false; // Set this immediately to prevent repeated calls
    
    const loadInitialData = async () => {
      if (!isMounted) return;
      
      try {
        // Get the first random kana
        await fetchNextKana();
        
        // Get performance data after initial kana load
        try {
          await getKanaPerformance();
        } catch (performanceError) {
          console.error('Error loading performance data:', performanceError);
          // Continue even if performance data fails
        }
        
        // Mark data as initialized
        setIsDataInitialized(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
        if (isMounted) {
          setMessage(prev => ({ 
            ...prev, 
            error: 'Error loading data. Please refresh the page.' 
          }));
          setHasError(true);
          setIsDataInitialized(true); // Mark as initialized even on error
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Set a timeout for data loading
    timeoutId = setTimeout(() => {
      if (isMounted && !isDataInitialized) {
        setMessage(prev => ({
          ...prev,
          error: 'Data loading took too long. Check your network connection and refresh the page.'
        }));
        setHasError(true);
        setIsLoading(false);
        setIsDataInitialized(true);
        
        // Set a fallback character
        const timeoutFallback: Character = { 
          hiragana: kanaType === 'hiragana' ? 'あ' : undefined,
          katakana: kanaType === 'katakana' ? 'ア' : undefined,
          romanji: 'a',
          weight: 1
        };
        setCurrentKana(timeoutFallback);
      }
    }, 10000); // 10-second timeout
    
    loadInitialData();
    
    return () => {
      isMounted = false;
      isNavigatingRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [fetchNextKana, getKanaPerformance, kanaType]);

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

        // Fetch new performance data and the next kana
        await getKanaPerformance();
        await fetchNextKana();

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
      console.error('Error submitting answer:', error);
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
          {hasError && (
            <button 
              className="retry-button" 
              onClick={() => {
                setMessage(prev => ({ ...prev, error: '' }));
                setHasError(false);
                setIsLoading(true);
                fetchNextKana();
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}
      
      <div className="kanaBox">
        <div className="kanaCard">
          <h1 className="kanaCharacter">
            {isLoading && !isDataInitialized ? "Loading..." : kanaType === 'hiragana' ? currentKana.hiragana : currentKana.katakana}
          </h1>
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
