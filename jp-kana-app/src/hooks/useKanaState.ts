import { useState, useRef, useCallback } from "react";
import { Character, KanaMessage, KanaPerformanceData, KanaType } from "@/types/kana";
import { createFallbackCharacter } from "../utils/kanaUtils";

export const useKanaState = (kanaType: KanaType) => {
  const defaultCharacter: Character = {
    kana: "",
    romaji: "",
    type: kanaType,
    weight: 1,
  };
  const isInitialLoadRef = useRef(true);
  const previousKanaRef = useRef<string[]>([]);
  const mountedRef = useRef(true);

  const [currentKana, setCurrentKana] = useState<Character>(defaultCharacter);
  const [inputValue, setInputValue] = useState<string>("");
  const [message, setMessage] = useState<KanaMessage>({
    correct: "",
    incorrect: "",
    error: "",
  });
  const [performanceData, setPerformanceData] = useState<KanaPerformanceData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isDataInitialized, setIsDataInitialized] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
    setMessage((prev) => ({ ...prev, error: "" }));
  };

  const checkAnswer = useCallback(() => {
    if (!currentKana || !currentKana.romaji) {
      return;
    }

    const isAnswerCorrect =
      currentKana.romaji.toLowerCase() === inputValue.toLowerCase();
    setIsCorrect(isAnswerCorrect);

    // ... existing code ...
  }, [currentKana, inputValue]);

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
  };
};
