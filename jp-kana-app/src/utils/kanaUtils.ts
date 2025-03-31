import { Character, KanaType } from '../types/kana';

export const createFallbackCharacter = (kanaType: KanaType): Character => {
  return {
    hiragana: kanaType === 'hiragana' ? 'あ' : undefined,
    katakana: kanaType === 'katakana' ? 'ア' : undefined,
    romanji: 'a',
    weight: 1
  };
};

export const isRecentlyShown = (kana: string, previousKana: string[]): boolean => {
  return previousKana.includes(kana);
};

export const updateKanaHistory = (kana: string, previousKana: string[]): string[] => {
  if (!kana) return previousKana;
  
  const maxHistorySize = 5;
  return [
    kana,
    ...previousKana.slice(0, maxHistorySize - 1)
  ];
}; 