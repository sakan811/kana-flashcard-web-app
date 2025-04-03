"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type KanaWithAccuracy = {
  id: string;
  character: string;
  romaji: string;
  accuracy: number;
};

type FlashcardContextType = {
  currentKana: KanaWithAccuracy | null;
  loadingKana: boolean;
  submitAnswer: (answer: string) => void;
  result: "correct" | "incorrect" | null;
  nextCard: () => void;
};

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined,
);

export function useFlashcard() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error("useFlashcard must be used within a FlashcardProvider");
  }
  return context;
}

// Add kanaType to the props
export function FlashcardProvider({
  children,
  kanaType,
}: {
  children: React.ReactNode;
  kanaType?: "hiragana" | "katakana";
}) {
  const { data: session } = useSession();
  const [kanaList, setKanaList] = useState<KanaWithAccuracy[]>([]);
  const [currentKana, setCurrentKana] = useState<KanaWithAccuracy | null>(null);
  const [loadingKana, setLoadingKana] = useState(true);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  // Fetch kana list with user's accuracy data
  useEffect(() => {
    if (session?.user) {
      fetchKanaData();
    }
  }, [session, kanaType]);

  const fetchKanaData = async () => {
    setLoadingKana(true);
    try {
      const response = await fetch("/api/flashcards");
      if (!response.ok) {
        throw new Error("Failed to fetch kana data");
      }
      let data = await response.json();

      // Filter by kana type if specified
      if (kanaType) {
        data = data.filter((kana: KanaWithAccuracy) => {
          const isHiragana =
            kana.character.charCodeAt(0) >= 0x3040 &&
            kana.character.charCodeAt(0) <= 0x309f;
          return kanaType === "hiragana" ? isHiragana : !isHiragana;
        });
      }

      setKanaList(data);
      selectRandomKana(data);
    } catch (error) {
      console.error("Error fetching kana data:", error);
    } finally {
      setLoadingKana(false);
    }
  };

  // Select a random kana based on weighted probability
  const selectRandomKana = (data: KanaWithAccuracy[]) => {
    if (!data.length) return;

    // Calculate weights (inverse of accuracy)
    const totalWeight = data.reduce(
      (sum, kana) => sum + (1 - kana.accuracy),
      0,
    );
    let randomVal = Math.random() * totalWeight;

    // Select kana based on weighted probability
    for (const kana of data) {
      const weight = 1 - kana.accuracy;
      randomVal -= weight;

      if (randomVal <= 0) {
        setCurrentKana(kana);
        break;
      }
    }
  };

  // Submit answer and update accuracy
  const submitAnswer = async (answer: string) => {
    if (!currentKana || !session?.user) return;

    const isCorrect =
      answer.trim().toLowerCase() === currentKana.romaji.toLowerCase();
    setResult(isCorrect ? "correct" : "incorrect");

    try {
      await fetch("/api/flashcards/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kanaId: currentKana.id,
          isCorrect,
        }),
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // Proceed to next kana
  const nextCard = () => {
    setResult(null);
    selectRandomKana(kanaList);
  };

  const value = {
    currentKana,
    loadingKana,
    submitAnswer,
    result,
    nextCard,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}
