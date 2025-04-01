import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Character, KanaType } from "@/types/kana";
import { submitAnswer } from "@/lib/flashcard-service";
import {
  getKanaPerformance as fetchKanaPerformance,
  getRandomKana as fetchRandomKana,
} from "@/lib/api-service";
import { useKanaState } from "./useKanaState";
import {
  isRecentlyShown,
  updateKanaHistory,
  createFallbackCharacter,
} from "@/utils/kanaUtils";

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

  const getRandomKana = useCallback(async (): Promise<Character> => {
    if (!userId) return createFallbackCharacter(kanaType);

    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const randomKana = await fetchRandomKana(userId, kanaType);

          if (!randomKana || typeof randomKana !== "object") {
            continue;
          }

          const kanaValue = randomKana.kana;

          if (
            !kanaValue ||
            !isRecentlyShown(kanaValue, previousKanaRef.current) ||
            attempt === 2
          ) {
            if (kanaValue) {
              previousKanaRef.current = updateKanaHistory(
                kanaValue,
                previousKanaRef.current,
              );
            }
            return randomKana;
          }
        } catch {
          if (attempt === 2) {
            return createFallbackCharacter(kanaType);
          }
        }
      }
      return createFallbackCharacter(kanaType);
    } catch {
      return createFallbackCharacter(kanaType);
    }
  }, [kanaType, userId, previousKanaRef]);

  const getKanaPerformance = useCallback(async () => {
    if (isNavigatingRef.current || !mountedRef.current || !userId) return;

    try {
      const data = await fetchKanaPerformance(userId, kanaType);
      if (!isNavigatingRef.current && mountedRef.current) {
        setPerformanceData(data);
        setHasError(false);
      }
    } catch {
      if (!isNavigatingRef.current && mountedRef.current) {
        setPerformanceData([]);
        setMessage((prev) => ({
          ...prev,
          error: "Database connection error. Please check your configuration.",
        }));
        setHasError(true);
      }
    }
  }, [
    kanaType,
    isNavigatingRef,
    userId,
    setPerformanceData,
    setHasError,
    setMessage,
    mountedRef,
  ]);

  const fetchNextKana = useCallback(async () => {
    if (isNavigatingRef.current || !mountedRef.current) return;

    setIsLoading(true);
    setIsProcessingAnswer(false); // Reset processing state when fetching new kana

    const safetyTimeout = setTimeout(() => {
      safelyExitLoadingState();
    }, 1000);

    try {
      const randomKana = await getRandomKana();
      if (!isNavigatingRef.current && mountedRef.current) {
        setCurrentKana(randomKana);
        setHasError(false);
        setIsLoading(false);
        setIsDataInitialized(true);
      }
    } catch {
      if (!isNavigatingRef.current && mountedRef.current) {
        setMessage((prev) => ({
          ...prev,
          error: "Error fetching kana. Using fallback.",
        }));
        setCurrentKana(createFallbackCharacter(kanaType));
        setIsLoading(false);
        setIsDataInitialized(true);
      }
    } finally {
      clearTimeout(safetyTimeout);
    }
  }, [
    getRandomKana,
    isNavigatingRef,
    setCurrentKana,
    setHasError,
    setMessage,
    safelyExitLoadingState,
    kanaType,
    mountedRef,
    setIsLoading,
    setIsDataInitialized,
    setIsProcessingAnswer,
  ]);

  const handleSubmitAnswer = useCallback(
    async (answer: string) => {
      if (!userId) {
        setMessage((prev) => ({
          ...prev,
          error: "No authenticated user found",
        }));
        return;
      }

      if (
        isNavigatingRef.current ||
        !mountedRef.current ||
        !currentKana.romaji ||
        isLoading ||
        isProcessingAnswer
      )
        return;

      // Set processing state to true to prevent multiple submissions
      setIsProcessingAnswer(true);

      // Validate the user input against the current kana
      const isCorrect =
        answer.toLowerCase() === currentKana.romaji.toLowerCase();

      // Show immediate feedback to the user
      if (isCorrect) {
        setMessage((prev) => ({
          ...prev,
          correct: "Correct! 🎉",
          incorrect: "",
          error: "",
        }));
      } else {
        setMessage((prev) => ({
          ...prev,
          correct: "",
          incorrect: `Incorrect. "${currentKana.kana}" is pronounced "${currentKana.romaji}".`,
          error: "",
        }));
      }

      try {
        // Record the answer in the database
        await submitAnswer(userId, kanaType, answer, currentKana, isCorrect);

        await getKanaPerformance();

        // Clear the feedback message after a delay
        const feedbackTimeout = setTimeout(() => {
          if (!isNavigatingRef.current && mountedRef.current) {
            setMessage((prev) => ({
              ...prev,
              correct: "",
              incorrect: "",
              error: "",
            }));
            setHasError(false);

            // After showing feedback, fetch the next kana
            fetchNextKana();
            // Note: setIsProcessingAnswer(false) is handled in fetchNextKana
          }
        }, 1500);

        return () => clearTimeout(feedbackTimeout);
      } catch (error) {
        console.error("Error submitting answer:", error);
        setMessage((prev) => ({
          ...prev,
          error: "Failed to record answer. Please try again.",
        }));
        setIsProcessingAnswer(false); // Reset processing state on error
      }
    },
    [
      currentKana,
      kanaType,
      isNavigatingRef,
      mountedRef,
      setMessage,
      setHasError,
      userId,
      getKanaPerformance,
      fetchNextKana,
      isLoading,
      isProcessingAnswer,
      setIsProcessingAnswer,
    ],
  );

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setIsProcessingAnswer(false); // Reset processing state when retrying

    const safetyTimeout = setTimeout(() => {
      safelyExitLoadingState();
    }, 2000);

    fetchNextKana()
      .catch(() => {
        setMessage((prev) => ({
          ...prev,
          error: "Failed to retry. Using fallback data.",
        }));
        safelyExitLoadingState();
      })
      .finally(() => {
        clearTimeout(safetyTimeout);
      });
  }, [
    fetchNextKana,
    safelyExitLoadingState,
    setHasError,
    setIsLoading,
    setMessage,
    setIsProcessingAnswer,
  ]);

  useEffect(() => {
    mountedRef.current = true;
    isNavigatingRef.current = false;

    return () => {
      mountedRef.current = false;
      isNavigatingRef.current = true;
    };
  }, [isNavigatingRef, mountedRef]);

  useEffect(() => {
    if (!isInitialLoadRef.current) return;

    isInitialLoadRef.current = false;

    const timeoutId = setTimeout(() => {
      if (
        !isNavigatingRef.current &&
        mountedRef.current &&
        !isDataInitialized
      ) {
        setMessage((prev) => ({
          ...prev,
          error:
            "Database connection is taking longer than expected. Please wait while we retry...",
        }));

        setCurrentKana(createFallbackCharacter(kanaType));
        safelyExitLoadingState();

        const retryTimeout = setTimeout(async () => {
          if (!isNavigatingRef.current && mountedRef.current) {
            try {
              await fetchNextKana();
              await getKanaPerformance();
              setMessage((prev) => ({ ...prev, error: "" }));
            } catch {
              // Silently handle retry failure
            }
          }
        }, 5000);

        return () => clearTimeout(retryTimeout);
      }
    }, 5000);

    const loadInitialData = async () => {
      if (!mountedRef.current) return;

      try {
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            await fetchNextKana();
            break;
          } catch {
            retryCount++;
            if (retryCount === maxRetries)
              throw new Error("Max retries reached");
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (!isNavigatingRef.current && mountedRef.current) {
          await getKanaPerformance();
          setIsLoading(false);
          setIsDataInitialized(true);
        }
      } catch {
        if (!isNavigatingRef.current && mountedRef.current) {
          setMessage((prev) => ({
            ...prev,
            error:
              "Unable to connect to database. Please check if the database is running.",
          }));
          setCurrentKana(createFallbackCharacter(kanaType));
          safelyExitLoadingState();
        }
      }
    };

    loadInitialData().finally(() => {
      if (!isNavigatingRef.current && mountedRef.current) {
        safelyExitLoadingState();
      }
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    fetchNextKana,
    getKanaPerformance,
    kanaType,
    safelyExitLoadingState,
    isDataInitialized,
    isInitialLoadRef,
    mountedRef,
    setCurrentKana,
    setIsDataInitialized,
    setIsLoading,
    setMessage,
    isNavigatingRef,
  ]);

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
    clearErrorMessage,
    isProcessingAnswer,
  };
}
