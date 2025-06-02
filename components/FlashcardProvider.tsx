/*
 * Japanese Kana Flashcard App
 * Copyright (C) 2025  Sakan Nirattisaykul
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

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

export function FlashcardProvider({
  children,
  kanaType,
}: {
  children: React.ReactNode;
  kanaType?: "hiragana" | "katakana";
}) {
  const [kanaList, setKanaList] = useState<KanaWithAccuracy[]>([]);
  const [currentKana, setCurrentKana] = useState<KanaWithAccuracy | null>(null);
  const [loadingKana, setLoadingKana] = useState(true);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const hasFetched = useRef(false);

  // Prevent double fetch in React strict mode
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchKanaData();
    }
  }, [kanaType]);

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
    if (!currentKana) return;

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
