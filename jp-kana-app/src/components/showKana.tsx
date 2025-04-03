"use client";

import React, { useRef } from "react";
import { useKanaFlashcard } from "../hooks/useKanaFlashcard";
import { useKanaForm } from "../hooks/useKanaForm";
import KanaDisplay from "./kana/KanaDisplay";
import KanaInput from "./kana/KanaInput";
import MessageDisplay from "./kana/MessageDisplay";
import KanaHeader from "./kana/KanaHeader";
import KanaTable from "./kana/KanaTable";
import { KanaType } from "@/types/kana";

interface KanaProps {
  kanaType: KanaType;
  onNavigateBack: () => void;
}

const RandomKana: React.FC<KanaProps> = ({ kanaType, onNavigateBack }) => {
  const isNavigatingRef = useRef(false);

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
    isProcessingAnswer,
  } = useKanaFlashcard(kanaType, isNavigatingRef);

  const { inputRef, handleSubmit, handleChange, disabled } = useKanaForm({
    onSubmit: handleSubmitAnswer,
    setInputValue,
    disabled: isLoading || isNavigatingRef.current || hasError,
    isProcessingAnswer,
  });

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
      <KanaHeader
        kanaType={kanaType}
        onBackClick={handleBackClick}
        isNavigating={isNavigatingRef.current}
      />

      <MessageDisplay
        message={message}
        hasError={hasError}
        onRetry={() => {
          clearErrorMessage();
          handleRetry();
        }}
      />

      <KanaDisplay
        currentKana={currentKana}
        isLoading={isLoading}
        isDataInitialized={isDataInitialized}
      />

      <KanaInput
        inputValue={inputValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        disabled={disabled}
        inputRef={inputRef}
      />

      <KanaTable kanaType={kanaType} performanceData={performanceData} />
    </div>
  );
};

export default RandomKana;
