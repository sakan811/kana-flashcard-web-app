import { Character, KanaType } from "@/types/kana";

/**
 * Creates a fallback character to use when data loading fails
 */
export function createFallbackCharacter(type: KanaType): Character {
  const fallbackChar = type === KanaType.hiragana ? "あ" : "ア";
  const fallbackRomaji = "a";
  
  return {
    id: -1,
    kana: fallbackChar,
    character: fallbackChar,
    romaji: fallbackRomaji,
    type: type,
    weight: 1,
  };
}

// Removed legacy data normalization function as it is no longer used.

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
