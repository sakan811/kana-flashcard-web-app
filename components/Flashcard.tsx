/*
 * SakuMari - Japanese Kana Flashcard App
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

import { useState, useEffect, useRef } from "react";
import { useFlashcard } from "./FlashcardProvider";

export default function Flashcard() {
  const { currentKana, loadingKana, submitAnswer, result, nextCard } =
    useFlashcard();
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Focus input when component mounts, when card changes, or after result is cleared
  useEffect(() => {
    if (
      inputRef.current &&
      !loadingKana &&
      currentKana &&
      !result &&
      !isProcessing
    ) {
      inputRef.current.focus();
    }
  }, [currentKana, loadingKana, result, isProcessing]);

  // Handle Enter key when result is shown
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && result && !isProcessing) {
        setIsProcessing(true);
        nextCard();
        setAnswer("");
        setError("");
        // Allow a brief delay before enabling the next action
        setTimeout(() => setIsProcessing(false), 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [result, nextCard, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    // Validate the answer isn't empty
    if (!result && !answer.trim()) {
      setError("Please enter an answer");
      return;
    }

    setIsProcessing(true);
    setError(""); // Clear any previous errors

    if (!result) {
      submitAnswer(answer);
    } else {
      nextCard();
      setAnswer("");
    }

    // Allow a brief delay before enabling the next action
    setTimeout(() => setIsProcessing(false), 500);
  };

  if (loadingKana) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-[#d1622b] border-t-transparent"
          role="status"
        ></div>
      </div>
    );
  }

  if (!currentKana) {
    return (
      <div className="text-center">
        <p className="text-lg text-[#705a39]">No flashcards available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 rounded-lg bg-gradient-to-br from-[#fad182] via-[#fad182] to-[#f5c55a] shadow-xl border-2 border-[#705a39] aspect-[2.5/3.5] flex flex-col justify-between p-6">
        <div className="flex-grow flex items-center justify-center">
          <h2 className="text-[10rem] sm:text-[14rem] leading-none font-bold text-[#403933] drop-shadow-sm">
            {currentKana.character}
          </h2>
        </div>

        {result && (
          <div
            className={`mb-4 rounded-md p-3 text-center border-2 ${
              result === "correct"
                ? "bg-green-50 text-green-800 border-green-300"
                : "bg-[#ae0d13] text-white border-[#950a1e]"
            }`}
          >
            <p className="text-lg font-semibold">
              {result === "correct" ? "Correct!" : "Incorrect!"}
            </p>
            <p>
              The correct answer is: <strong>{currentKana.romaji}</strong>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-auto flex flex-col">
          {!result ? (
            <>
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (error && e.target.value.trim()) {
                    setError("");
                  }
                }}
                placeholder="Type romaji equivalent..."
                className={`mb-2 rounded-md border-2 ${
                  error ? "border-[#ae0d13]" : "border-[#705a39]"
                } px-4 py-2 focus:border-[#d1622b] focus:outline-none bg-white text-[#403933] placeholder-[#705a39]`}
                disabled={isProcessing}
                autoFocus
              />
              {error && (
                <div className="mb-2 text-[#ae0d13] text-sm font-medium">
                  {error}
                </div>
              )}
            </>
          ) : (
            <div></div>
          )}
          <button
            type="submit"
            role="button"
            disabled={isProcessing}
            className={`rounded-md px-4 py-2 font-medium text-white transition-all duration-200 border-2 ${
              isProcessing
                ? "bg-[#705a39] cursor-not-allowed border-[#705a39]"
                : "bg-[#d1622b] hover:bg-[#ae0d13] border-[#d1622b] hover:border-[#ae0d13] shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {result
              ? isProcessing
                ? "Loading..."
                : "Next Card"
              : isProcessing
                ? "Submitting..."
                : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
