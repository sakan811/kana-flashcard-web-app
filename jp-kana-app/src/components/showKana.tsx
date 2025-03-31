"use client";

import React, { useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import KanaPerformanceTable from "./performanceTable/kanaPerformanceTable";
import { useKanaFlashcard } from "../hooks/useKanaFlashcard";
import KanaDisplay from "./kana/KanaDisplay";
import KanaInput from "./kana/KanaInput";
import MessageDisplay from "./kana/MessageDisplay";
import BackButton from "./ui/BackButton";

interface KanaProps {
  kanaType: "hiragana" | "katakana";
  onNavigateBack: () => void;
}

const RandomKana: React.FC<KanaProps> = ({ kanaType, onNavigateBack }) => {
  const { status } = useSession();
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useKanaFlashcard(kanaType, isNavigatingRef);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  // Show error if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Authentication Required
        </h1>
        <p className="text-xl mb-10 max-w-2xl text-gray-600 dark:text-gray-300">
          Please sign in to access the flashcards.
        </p>
      </div>
    );
  }

  const tableColumns = [
    {
      key: kanaType === "hiragana" ? "hiragana" : "katakana",
      header: kanaType === "hiragana" ? "Hiragana" : "Katakana",
    },
    { key: "romanji", header: "Romanji" },
    { key: "correctCount", header: "Correct Answers" },
    { key: "totalCount", header: "Total Answers" },
    { key: "accuracy", header: "Accuracy (%)" },
  ];

  const tableTitle = `${kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Performance`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSubmitAnswer(inputValue);
    setInputValue("");

    // Focus the input element after submission with a small delay
    // to allow the DOM to update first
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleBackClick = () => {
    // Set navigating flag to prevent further state updates
    isNavigatingRef.current = true;

    // Use requestAnimationFrame to avoid forcing layout during click event
    requestAnimationFrame(() => {
      onNavigateBack();
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8 relative">
        <div className="absolute left-0">
          <BackButton
            onClick={handleBackClick}
            disabled={isNavigatingRef.current}
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mx-auto w-full text-center">
          {kanaType === "hiragana"
            ? "Hiragana Flashcard"
            : "Katakana Flashcard"}
        </h1>
      </div>

      <MessageDisplay
        error={message.error}
        hasError={hasError}
        onRetry={() => {
          clearErrorMessage();
          handleRetry();
        }}
      />

      <KanaDisplay
        kanaType={kanaType}
        currentKana={currentKana}
        isLoading={isLoading}
        isDataInitialized={isDataInitialized}
      />

      <KanaInput
        inputValue={inputValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        disabled={isLoading || isNavigatingRef.current || hasError}
        inputRef={inputRef}
      />

      {message.correct && (
        <p className="mt-4 text-green-600 dark:text-green-400 font-medium text-lg text-center">
          {message.correct}
        </p>
      )}
      {message.incorrect && (
        <p
          className="mt-4 text-red-600 dark:text-red-400 font-medium text-lg text-center"
          dangerouslySetInnerHTML={{ __html: message.incorrect }}
        ></p>
      )}

      <div className="mt-8">
        <KanaPerformanceTable
          performanceData={performanceData}
          columns={tableColumns}
          title={tableTitle}
          kanaType={kanaType}
        />
      </div>
    </div>
  );
};

export default RandomKana;
