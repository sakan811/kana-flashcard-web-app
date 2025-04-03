import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { KanaType, KanaPerformanceData } from "@/types/kana";
import { useKanaState, KanaMessageState } from "./useKanaState";
import apiClient from "@/lib/api-client";
import { normalizeKanaData } from "@/utils/kanaUtils";

/**
 * Custom hook for managing kana flashcard state and interactions
 * Enhanced to use centralized API client and follow Next.js best practices
 */
export function useKanaFlashcard(
  kanaType: KanaType,
  isNavigatingRef: { current: boolean },
) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const {
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
    isProcessingAnswer,
    setIsProcessingAnswer,
  } = useKanaState(kanaType);

  // Load kana performance data
  const loadPerformanceData = useCallback(async () => {
    if (!userId || !mountedRef.current) return;
    
    try {
      setIsLoading(true);
      const data = await apiClient.kana.getUserPerformance(userId, kanaType);
      if (mountedRef.current) {
        // Create properly typed KanaPerformanceData objects
        const typedData: KanaPerformanceData[] = data.map(item => ({
          id: 0, // Default ID (will be auto-generated on server)
          userId: userId,
          kana: item.kana,
          kanaType: item.kanaType as KanaType,
          correctCount: item.correctCount,
          totalCount: item.totalCount,
          accuracy: item.accuracy,
          percentage: item.accuracy, // Assume percentage is same as accuracy
          lastPracticed: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        setPerformanceData(typedData);
      }
    } catch (error) {
      console.error("Error loading performance data:", error);
      if (mountedRef.current) {
        setHasError(true);
        setMessage({
          type: "error",
          text: "Failed to load performance data. Please try again."
        });
      }
    } finally {
      if (mountedRef.current) {
        safelyExitLoadingState();
      }
    }
  }, [userId, kanaType, mountedRef, setPerformanceData, setIsLoading, setHasError, setMessage, safelyExitLoadingState]);

  // Fetch a random kana based on user's performance
  const fetchRandomKana = useCallback(async () => {
    if (!userId || !mountedRef.current || isNavigatingRef.current) return;
    
    try {
      setIsLoading(true);
      const responseData = await apiClient.kana.getRandomKana(kanaType, userId);
      
      // Normalize data to ensure consistent format
      const normalizedKana = normalizeKanaData(responseData);
      
      if (mountedRef.current && !isNavigatingRef.current) {
        setCurrentKana(normalizedKana);
        previousKanaRef.current = normalizedKana;
      }
    } catch (error) {
      console.error("Error fetching random kana:", error);
      if (mountedRef.current && !isNavigatingRef.current) {
        setHasError(true);
        setMessage({
          type: "error",
          text: "Failed to load kana data. Please try again."
        });
      }
    } finally {
      if (mountedRef.current && !isNavigatingRef.current) {
        safelyExitLoadingState();
        setIsDataInitialized(true);
      }
    }
  }, [userId, kanaType, mountedRef, isNavigatingRef, setCurrentKana, previousKanaRef, setHasError, setMessage, safelyExitLoadingState, setIsDataInitialized, setIsLoading]);

  // Submit answer handler
  const handleSubmitAnswer = useCallback(async (answer: string) => {
    if (!userId || !currentKana || isProcessingAnswer || isNavigatingRef.current) return;
    if (!currentKana.character) {
      console.error("Cannot submit answer: current kana has no kana character");
      return;
    }
    
    try {
      setIsProcessingAnswer(true);
      clearErrorMessage();
      const isCorrect = answer.toLowerCase() === currentKana.romaji.toLowerCase();
      
      // Record performance
      await apiClient.kana.recordPerformance(
        currentKana.character,
        isCorrect,
        kanaType as 'hiragana' | 'katakana',
        userId
      );
      
      // Show feedback message
      setMessage({
        type: isCorrect ? "success" : "error",
        text: isCorrect
          ? "Correct!"
          : `Incorrect. The correct answer is "${currentKana.romaji}".`
      });
      
      // Clear input field after submitting
      setInputValue("");
      
      // Load updated performance data
      await loadPerformanceData();
      
      // Fetch next kana after a delay
      const timeoutId = setTimeout(() => {
        if (mountedRef.current && !isNavigatingRef.current) {
          clearErrorMessage();
          fetchRandomKana();
        }
      }, 1500);
      
      // Clean up timeout if component unmounts
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error("Error submitting answer:", error);
      if (mountedRef.current && !isNavigatingRef.current) {
        setHasError(true);
        setMessage({
          type: "error",
          text: "Failed to process your answer. Please try again."
        });
      }
    } finally {
      if (mountedRef.current && !isNavigatingRef.current) {
        setIsProcessingAnswer(false);
      }
    }
  }, [userId, currentKana, kanaType, isProcessingAnswer, isNavigatingRef, mountedRef, setIsProcessingAnswer, clearErrorMessage, setMessage, setInputValue, loadPerformanceData, fetchRandomKana, setHasError]);

  // Handle retry after error
  const handleRetry = useCallback(() => {
    if (mountedRef.current) {
      setHasError(false);
      fetchRandomKana();
    }
  }, [fetchRandomKana, mountedRef, setHasError]);

  // Initialize data on component mount
  useEffect(() => {
    if (userId && !isDataInitialized && isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      loadPerformanceData();
      fetchRandomKana();
    }
    
    // Clean up function
    return () => {
      // This helps prevent state updates after unmount
      mountedRef.current = false;
    };
  }, [userId, isDataInitialized, loadPerformanceData, fetchRandomKana, isInitialLoadRef, mountedRef]);

  return {
    currentKana,
    inputValue,
    setInputValue,
    message,
    performanceData,
    isLoading,
    hasError,
    isDataInitialized,
    handleSubmitAnswer,
    handleRetry,
    clearErrorMessage,
    isProcessingAnswer,
  };
}
