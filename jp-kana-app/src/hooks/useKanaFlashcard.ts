import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { KanaType } from "@/types/kana";
import { useKanaState } from "./useKanaState";
import { kanaApi } from "@/lib/api-client";

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
      const data = await kanaApi.getKanaPerformance(userId, kanaType);
      if (mountedRef.current) {
        setPerformanceData(data);
      }
    } catch (error) {
      console.error("Error loading performance data:", error);
      if (mountedRef.current) {
        setHasError(true);
        setMessage({
          type: "error",
          text: "Failed to load performance data. Please try again.",
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
      const kana = await kanaApi.getRandomKana(userId, kanaType);
      
      if (mountedRef.current && !isNavigatingRef.current) {
        setCurrentKana(kana);
        previousKanaRef.current = kana;
      }
    } catch (error) {
      console.error("Error fetching random kana:", error);
      if (mountedRef.current && !isNavigatingRef.current) {
        setHasError(true);
        setMessage({
          type: "error",
          text: "Failed to load kana data. Please try again.",
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
    
    try {
      setIsProcessingAnswer(true);
      clearErrorMessage();
      const isCorrect = answer.toLowerCase() === currentKana.romaji.toLowerCase();
      
      // Record performance
      await kanaApi.recordPerformance(
        userId, 
        currentKana.kana, 
        kanaType, 
        isCorrect
      );
      
      // Update progress
      await kanaApi.updateProgress(
        userId,
        currentKana.kana,
        kanaType,
        isCorrect
      );
      
      // Show feedback message
      setMessage({
        type: isCorrect ? "success" : "error",
        text: isCorrect
          ? "Correct!"
          : `Incorrect. The correct answer is "${currentKana.romaji}".`,
      });
      
      // Clear input field after submitting
      setInputValue("");
      
      // Load updated performance data
      await loadPerformanceData();
      
      // Fetch next kana after a delay
      setTimeout(() => {
        if (mountedRef.current && !isNavigatingRef.current) {
          clearErrorMessage();
          fetchRandomKana();
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting answer:", error);
      if (mountedRef.current && !isNavigatingRef.current) {
        setHasError(true);
        setMessage({
          type: "error",
          text: "Failed to process your answer. Please try again.",
        });
      }
    } finally {
      if (mountedRef.current && !isNavigatingRef.current) {
        setIsProcessingAnswer(false);
      }
    }
  }, [userId, currentKana, kanaType, isProcessingAnswer, isNavigatingRef, mountedRef, setIsProcessingAnswer, clearErrorMessage, setMessage, setInputValue, loadPerformanceData, fetchRandomKana, setHasError]);

  // Initialize data on component mount
  useEffect(() => {
    if (userId && !isDataInitialized && isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      loadPerformanceData();
      fetchRandomKana();
    }
  }, [userId, isDataInitialized, loadPerformanceData, fetchRandomKana, isInitialLoadRef]);

  return {
    currentKana,
    inputValue,
    setInputValue,
    message,
    performanceData,
    isLoading,
    hasError,
    handleSubmitAnswer,
    fetchRandomKana,
    loadPerformanceData,
    isProcessingAnswer,
  };
}
