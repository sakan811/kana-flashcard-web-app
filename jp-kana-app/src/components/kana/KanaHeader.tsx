import React from "react";
import BackButton from "../ui/BackButton";
import { KanaType } from "@/types/kana";

interface KanaHeaderProps {
  kanaType: KanaType;
  onBackClick: () => void;
  isNavigating: boolean;
}

const KanaHeader: React.FC<KanaHeaderProps> = ({
  kanaType,
  onBackClick,
  isNavigating,
}) => {
  return (
    <div className="flex items-center mb-8 relative">
      <div className="absolute left-0">
        <BackButton onClick={onBackClick} disabled={isNavigating} />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mx-auto w-full text-center">
        {kanaType === "hiragana" ? "Hiragana Flashcard" : "Katakana Flashcard"}
      </h1>
    </div>
  );
};

export default KanaHeader;
