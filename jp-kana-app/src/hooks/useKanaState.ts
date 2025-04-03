import { useState, useRef, useCallback } from "react";
import {
  Character,
  KanaPerformanceData,
  KanaType,
} from "@/types/kana";
import { createFallbackCharacter } from "../utils/kanaUtils";

type MessageType = 'success' | 'error' | 'info';

export interface KanaMessageState {
  type: MessageType;
  text: string;
}

export const useKanaState = (kanaType: KanaType) => {
  const defaultCharacter: Character = {
    kana: "",
    romaji: "",
    type: kanaType,
    weight: 1,
  };
  const isInitialLoadRef = useRef(true);
  const previousKanaRef = useRef<Character | null>(null);
  const mountedRef = useRef(true);

  const [currentKana, setCurrentKana] = useState<Character>(defaultCharacter);
  const [inputValue, setInputValue] = useState<string>("");
  const [message, setMessage] = useState<KanaMessageState>({
    type: 'info',
    text: '',
  });
  const [performanceData, setPerformanceData] = useState<KanaPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isDataInitialized, setIsDataInitialized] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState<boolean>(false);

  const safelyExitLoadingState = () => {
    if (!mountedRef.current) return;

    setIsLoading(false);
    setCurrentKana((current) => {
      if (!current || !current.romaji) {
        return createFallbackCharacter(kanaType);
      }
      return current;
    });
    setIsDataInitialized(true);
  };

  const clearErrorMessage = () => {
    setMessage({ type: 'info', text: '' });
  };

  const checkAnswer = useCallback(() => {
    if (!currentKana || !currentKana.romaji) {
      return;
    }

    const isAnswerCorrect =
      currentKana.romaji.toLowerCase() === inputValue.toLowerCase();
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setMessage({ 
        type: 'success',
        text: "Correct! 🎉"
      });
    } else {
      setMessage({
        type: 'error',
        text: `Incorrect. The correct answer was: ${currentKana.romaji}`
      });
    }

    // Clear the message after 2 seconds
    setTimeout(() => {
      if (mountedRef.current) {
        setMessage({ type: 'info', text: '' });
      }
    }, 2000);

    return isAnswerCorrect;
  }, [currentKana, inputValue, mountedRef]);

  return {
    currentKana,
    setCurrentKana,
    inputValue,
    setInputValue,
    message,
    setMessage,
    performanceData,
    setPerformanceData,
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    isDataInitialized,
    setIsDataInitialized,
    isInitialLoadRef,
    previousKanaRef,
    mountedRef,
    safelyExitLoadingState,
    clearErrorMessage,
    isCorrect,
    setIsCorrect,
    checkAnswer,
    isProcessingAnswer,
    setIsProcessingAnswer,
  };
};
