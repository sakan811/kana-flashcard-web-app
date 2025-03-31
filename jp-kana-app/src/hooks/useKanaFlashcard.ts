import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';
import { 
  getKanaPerformance as fetchKanaPerformance, 
  getRandomKana as fetchRandomKana
} from '../lib/api-service';
import { submitAnswer } from '../components/funcs/showKanaFunc';
import { Character, KanaPerformanceData } from '../types';
import { DEFAULT_USER_ID } from '../constants';
import { useSession } from 'next-auth/react';

interface KanaMessage {
  correct: string;
  incorrect: string;
  error: string;
}

export function useKanaFlashcard(
  kanaType: 'hiragana' | 'katakana',
  isNavigatingRef: MutableRefObject<boolean>
) {
  const { data: session } = useSession();
  const userId = session?.user?.id || DEFAULT_USER_ID;
  
  // Initialize with a default empty character
  const defaultCharacter: Character = { romanji: "", weight: 1 };
  const isInitialLoadRef = useRef(true);
  const previousKanaRef = useRef<string[]>([]);
  const mountedRef = useRef(true);

  const [currentKana, setCurrentKana] = useState<Character>(defaultCharacter);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<KanaMessage>({ 
    correct: '', 
    incorrect: '',
    error: '' 
  });
  const [performanceData, setPerformanceData] = useState<KanaPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isDataInitialized, setIsDataInitialized] = useState<boolean>(false);

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

  // Create a fallback character based on kana type
  const createFallbackCharacter = useCallback((): Character => {
    console.log(`Creating fallback ${kanaType} character`);
    return {
      hiragana: kanaType === 'hiragana' ? 'あ' : undefined,
      katakana: kanaType === 'katakana' ? 'ア' : undefined,
      romanji: 'a',
      weight: 1
    };
  }, [kanaType]);

  // Ensure we always exit loading state
  const safelyExitLoadingState = useCallback(() => {
    console.log("Safely exiting loading state");
    if (!isNavigatingRef.current && mountedRef.current) {
      // Exit loading state and ensure we have a character to display
      setIsLoading(false);
      
      // If no current kana is set, use fallback
      setCurrentKana(current => {
        if (!current || !current.romanji) {
          return createFallbackCharacter();
        }
        return current;
      });
      
      // Mark as initialized
      setIsDataInitialized(true);
    }
  }, [isNavigatingRef, createFallbackCharacter]);

  // Function to fetch a random kana directly from the database
  const getRandomKana = useCallback(async (): Promise<Character> => {
    console.log("Getting random kana...");
    try {
      // Try up to 3 times to get a kana that hasn't been shown recently
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          console.log(`Fetch attempt ${attempt + 1} for ${kanaType}`);
          const randomKana = await fetchRandomKana(userId, kanaType);
          
          if (!randomKana || typeof randomKana !== 'object') {
            console.error('Invalid kana data received:', randomKana);
            continue; // Try again on invalid data
          }
          
          const kanaValue = kanaType === 'hiragana' ? randomKana.hiragana : randomKana.katakana;
          console.log(`Received kana: ${kanaValue}`);
          
          // If this kana hasn't been shown recently, or we're on our last attempt, use it
          if (!kanaValue || !isRecentlyShown(kanaValue) || attempt === 2) {
            if (kanaValue) {
              updateKanaHistory(kanaValue);
            }
            return randomKana;
          }
        } catch (attemptError) {
          console.error(`Error on fetch attempt ${attempt + 1}:`, attemptError);
          // Continue with next attempt
          if (attempt === 2) {
            // On last attempt, return fallback immediately instead of continuing
            console.warn('Last fetch attempt failed, using fallback');
            return createFallbackCharacter();
          }
        }
      }
      
      // All attempts failed, return fallback
      console.warn('All random kana fetch attempts failed, using fallback');
      return createFallbackCharacter();
    } catch (error) {
      console.error('Error in getRandomKana:', error);
      return createFallbackCharacter();
    }
  }, [kanaType, isRecentlyShown, updateKanaHistory, createFallbackCharacter, userId]);

  // Function to get kana performance data
  const getKanaPerformance = useCallback(async () => {
    if (isNavigatingRef.current || !mountedRef.current) return; // Prevent operations during navigation
    
    console.log(`Getting ${kanaType} performance data...`);
    const validKanaTypes = ['hiragana', 'katakana'];
    if (!validKanaTypes.includes(kanaType)) {
      console.error('Invalid kana type');
      if (!isNavigatingRef.current && mountedRef.current) {
        setPerformanceData([]);
      }
      return;
    }
    
    try {
      const data = await fetchKanaPerformance(userId, kanaType);
      console.log(`Got ${data.length} performance records`);
      // Only update state if component is still mounted and not navigating away
      if (!isNavigatingRef.current && mountedRef.current) {
        setPerformanceData(data);
        setHasError(false);
      }
    } catch (error) {
      console.error(`Error fetching ${kanaType} performance:`, error);
      if (!isNavigatingRef.current && mountedRef.current) {
        setPerformanceData([]);
        setMessage(prev => ({ ...prev, error: 'Database connection error. Please check your configuration.' }));
        setHasError(true);
      }
    }
  }, [kanaType, isNavigatingRef, userId]);

  // Function to fetch next kana
  const fetchNextKana = useCallback(async () => {
    if (isNavigatingRef.current || !mountedRef.current) {
      console.log("Skipping fetchNextKana - component is navigating away or unmounted");
      return;
    }
    
    console.log("Fetching next kana...");
    if (mountedRef.current) {
      setIsLoading(true);
    }
    
    let retryCount = 0;
    const MAX_RETRIES = 1; // Reduce retries for faster response
    
    // Set a safety timeout - always exit loading state after a delay
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout triggered - force exiting loading state");
      safelyExitLoadingState();
    }, 1000); // Reduced to 1 second for faster fallback
    
    const attemptFetch = async (): Promise<void> => {
      try {
        const randomKana = await getRandomKana();
        if (!isNavigatingRef.current && mountedRef.current) {
          console.log(`Setting kana: ${kanaType === 'hiragana' ? randomKana.hiragana : randomKana.katakana}`);
          setCurrentKana(randomKana);
          setHasError(false);
          
          // Explicitly exit loading state immediately after setting kana
          console.log("Exiting loading state after successful kana fetch");
          setIsLoading(false);
          setIsDataInitialized(true);
        }
      } catch (error) {
        console.error('Error fetching next kana:', error);
        
        if (retryCount < MAX_RETRIES && !isNavigatingRef.current && mountedRef.current) {
          retryCount++;
          console.log(`Retrying kana fetch (${retryCount}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 200)); // Shorter wait before retry
          return attemptFetch();
        }
        
        if (!isNavigatingRef.current && mountedRef.current) {
          setMessage(prev => ({ 
            ...prev, 
            error: 'Error fetching kana. Using fallback.' 
          }));
          
          // Set a minimal fallback character as last resort
          console.log("Setting fallback kana due to error");
          setCurrentKana(createFallbackCharacter());
          setIsLoading(false);
          setIsDataInitialized(true);
        }
      }
    };
    
    try {
      await attemptFetch();
    } catch (finalError) {
      console.error('Critical error in fetchNextKana:', finalError);
      // Ensure loading state is turned off even if everything fails
      safelyExitLoadingState();
    } finally {
      // IMPORTANT: Always clear the timeout to prevent stale state updates
      clearTimeout(safetyTimeout);
    }
  }, [getRandomKana, isNavigatingRef, createFallbackCharacter, safelyExitLoadingState, kanaType]);

  // Handle submitting an answer
  const handleSubmitAnswer = useCallback(async (answer: string) => {
    if (isNavigatingRef.current || !mountedRef.current) return;
    
    try {
      const kanaDisplay = kanaType === 'hiragana' ? currentKana.hiragana : currentKana.katakana;
      const isCorrect = currentKana.romanji.toLowerCase() === answer.toLowerCase();
      
      console.log(`Submitting answer for ${kanaDisplay}: ${answer} (Correct: ${isCorrect})`);
      setMessage({
        correct: isCorrect ? `Correct! "${kanaDisplay}" is "${currentKana.romanji}"` : '',
        incorrect: !isCorrect ? `Incorrect. "${kanaDisplay}" is "${currentKana.romanji}", not "${answer}"` : '',
        error: ''
      });
      
      // Clear success/error message after 3 seconds
      setTimeout(() => {
        if (!isNavigatingRef.current && mountedRef.current) {
          setMessage(prev => ({ ...prev, correct: '', incorrect: '' }));
        }
      }, 3000);
      
      // Record the answer in the database
      await submitAnswer(kanaType, answer, currentKana, isCorrect, userId);
      
      // Fetch new kana after submitting
      console.log("Fetching next kana after submission");
      await fetchNextKana();
      
      // Update performance data after submitting
      await getKanaPerformance();
    } catch (error) {
      console.error('Error submitting answer:', error);
      setMessage(prev => ({ 
        ...prev, 
        error: 'Error submitting your answer. Please try again.' 
      }));
      setHasError(true);
      
      // Clear error message after 1.5 seconds
      setTimeout(() => {
        if (!isNavigatingRef.current && mountedRef.current) {
          setMessage(prev => ({ ...prev, error: '' }));
          setHasError(false);
        }
      }, 1500);
    }
  }, [currentKana, fetchNextKana, getKanaPerformance, kanaType, isNavigatingRef, userId]);

  // Clear error message
  const clearErrorMessage = useCallback(() => {
    setMessage(prev => ({ ...prev, error: '' }));
  }, []);

  // Handle retry when there's an error
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    
    // Safety timeout for retry
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout triggered during retry");
      safelyExitLoadingState();
    }, 2000);
    
    fetchNextKana()
      .catch(error => {
        console.error('Error during retry:', error);
        setMessage(prev => ({ 
          ...prev, 
          error: 'Failed to retry. Using fallback data.' 
        }));
        safelyExitLoadingState();
      })
      .finally(() => {
        clearTimeout(safetyTimeout);
      });
  }, [fetchNextKana, safelyExitLoadingState]);

  // Track mount status for preventing updates on unmounted component
  useEffect(() => {
    console.log("Component mounted - resetting flags");
    mountedRef.current = true;
    isNavigatingRef.current = false;
    
    return () => {
      console.log("Cleaning up kana flashcard");
      mountedRef.current = false;
      isNavigatingRef.current = true;
    };
  }, []);

  // Initial data loading
  useEffect(() => {
    // Skip if component is already initialized
    if (!isInitialLoadRef.current) {
      console.log("Skipping initialization - already initialized");
      return;
    }
    
    console.log(`Initializing kana flashcard for ${kanaType}`);
    
    // Reset navigation flag to allow state updates (moved to mount effect)
    isInitialLoadRef.current = false; // Set this immediately to prevent repeated calls
    
    // Set a shorter timeout for data loading - this is our safety net
    const timeoutId = setTimeout(() => {
      if (!isNavigatingRef.current && mountedRef.current && !isDataInitialized) {
        console.warn('Data loading timeout reached - using fallback');
        
        setMessage(prev => ({
          ...prev,
          error: 'Data loading took too long. Using fallback data.'
        }));
        
        // Instead of just showing an error, set some fallback data and continue
        console.log("Setting fallback due to timeout");
        setCurrentKana(createFallbackCharacter());
        safelyExitLoadingState();
      }
    }, 1000); // Reduced to 1 second for faster fallback
    
    // Start the loading process
    const loadInitialData = async () => {
      if (!mountedRef.current) return;
      
      try {
        console.log("Loading initial data...");
        
        // Get the first random kana
        await fetchNextKana().catch(error => {
          console.error('Initial kana fetch failed:', error);
          if (!isNavigatingRef.current && mountedRef.current) {
            setCurrentKana(createFallbackCharacter());
            safelyExitLoadingState();
          }
        });
        
        // Get performance data after initial kana load
        if (!isNavigatingRef.current && mountedRef.current) {
          try {
            await getKanaPerformance();
          } catch (performanceError) {
            console.error('Error loading performance data:', performanceError);
            // Continue even if performance data fails
          }
        }
        
        // Make absolutely certain we're not in loading state
        if (!isNavigatingRef.current && mountedRef.current) {
          console.log("Ensuring loading is complete");
          setIsLoading(false);
          setIsDataInitialized(true);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        if (!isNavigatingRef.current && mountedRef.current) {
          setMessage(prev => ({ 
            ...prev, 
            error: 'Error loading data. Using fallback data.' 
          }));
          
          // Ensure we have at least a fallback character
          console.log("Setting fallback due to initialization error");
          setCurrentKana(createFallbackCharacter());
          safelyExitLoadingState();
        }
      }
    };
    
    loadInitialData().finally(() => {
      // Ensure loading state is turned off even if the above process fails
      if (!isNavigatingRef.current && mountedRef.current) {
        console.log("Finalizing initialization");
        safelyExitLoadingState();
      }
    });
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [fetchNextKana, getKanaPerformance, kanaType, isNavigatingRef, createFallbackCharacter, safelyExitLoadingState]);

  return {
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
  };
} 