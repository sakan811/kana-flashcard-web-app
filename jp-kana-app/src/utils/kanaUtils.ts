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

/**
 * Fixes legacy data format to match updated Character type expectations
 * Ensures compatibility between old (kana property) and new (character property) formats
 */
export function normalizeKanaData(data: any): Character {
  if (!data) {
    return createFallbackCharacter(KanaType.hiragana);
  }
  
  // Create a normalized object
  const normalized: Character = {
    ...data,
    // Ensure both kana and character properties exist for compatibility
    kana: data.kana || data.character || '',
    character: data.character || data.kana || '',
    // Ensure proper type
    type: typeof data.type === 'string' ? 
      (data.type === 'hiragana' ? KanaType.hiragana : KanaType.katakana) : 
      data.type,
    // Ensure weight exists
    weight: data.weight || 1,
    romaji: data.romaji || ''
  };
  
  // If normalized data is still invalid, return fallback
  if (!normalized.kana || !normalized.character || !normalized.romaji) {
    return createFallbackCharacter(KanaType.hiragana);
  }
  
  return normalized;
}

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
