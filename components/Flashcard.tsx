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
          className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
          role="status"
        ></div>
      </div>
    );
  }

  if (!currentKana) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-700">No flashcards available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 rounded-lg bg-white shadow-lg border border-gray-200 aspect-[2.5/3.5] flex flex-col justify-between p-6">
        <div className="flex-grow flex items-center justify-center">
          <h2 className="text-[10rem] sm:text-[14rem] leading-none font-bold text-gray-800">
            {currentKana.character}
          </h2>
        </div>

        {result && (
          <div
            className={`mb-4 rounded-md p-3 text-center ${
              result === "correct"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
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
                className={`mb-2 rounded-md border ${
                  error ? "border-red-500" : "border-gray-300"
                } px-4 py-2 focus:border-blue-500 focus:outline-none`}
                disabled={isProcessing}
                autoFocus
              />
              {error && (
                <div className="mb-2 text-red-600 text-sm">{error}</div>
              )}
            </>
          ) : (
            <div></div>
          )}
          <button
            type="submit"
            role="button"
            disabled={isProcessing}
            className={`rounded-md px-4 py-2 font-medium text-white transition ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
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