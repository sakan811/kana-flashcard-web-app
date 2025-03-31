import { Character, KanaType } from "@/types";

export const createFallbackCharacter = (kanaType: KanaType): Character => {
  return {
    id: 0,
    kana: kanaType === "hiragana" ? "あ" : "ア",
    romanji: "a",
    type: kanaType,
    weight: 1,
  };
};

export const isRecentlyShown = (
  kana: string,
  previousKana: string[],
): boolean => {
  return previousKana.includes(kana);
};

export const updateKanaHistory = (
  kana: string,
  previousKana: string[],
): string[] => {
  if (!kana) return previousKana;

  const maxHistorySize = 5;
  return [kana, ...previousKana.slice(0, maxHistorySize - 1)];
};
