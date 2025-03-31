import { useState, useRef } from "react";
import {
  Character,
  KanaMessage,
  KanaPerformanceData,
  KanaType,
} from "@/types";
import { createFallbackCharacter } from "../utils/kanaUtils";

export const useKanaState = (kanaType: KanaType) => {
  const defaultCharacter: Character = {
    kana: "",
    romanji: "",
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

  const safelyExitLoadingState = () => {
    if (!mountedRef.current) return;

    setIsLoading(false);
    setCurrentKana((current) => {
      if (!current || !current.romanji) {
        return createFallbackCharacter(kanaType);
      }
      return current;
    });
    setIsDataInitialized(true);
  };

  const clearErrorMessage = () => {
    setMessage((prev) => ({ ...prev, error: "" }));
  };

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
  };
};
