/**
 * Centralized kana data store
 * Single source of truth for hiragana and katakana characters
 */

import { KanaType } from '@/types/kana';

// Define the Kana interface used in this file
export interface Kana {
  id: string;
  character: string;
  romaji: string;
  type: string; 
  group: string;
}

/**
 * Complete collection of hiragana characters with metadata
 */
export const hiraganaData: Kana[] = [
  { id: 'a', character: 'あ', romaji: 'a', type: 'hiragana', group: 'basic' },
  { id: 'i', character: 'い', romaji: 'i', type: 'hiragana', group: 'basic' },
  { id: 'u', character: 'う', romaji: 'u', type: 'hiragana', group: 'basic' },
  { id: 'e', character: 'え', romaji: 'e', type: 'hiragana', group: 'basic' },
  { id: 'o', character: 'お', romaji: 'o', type: 'hiragana', group: 'basic' },
  { id: 'ka', character: 'か', romaji: 'ka', type: 'hiragana', group: 'k' },
  { id: 'ki', character: 'き', romaji: 'ki', type: 'hiragana', group: 'k' },
  { id: 'ku', character: 'く', romaji: 'ku', type: 'hiragana', group: 'k' },
  { id: 'ke', character: 'け', romaji: 'ke', type: 'hiragana', group: 'k' },
  { id: 'ko', character: 'こ', romaji: 'ko', type: 'hiragana', group: 'k' },
  { id: 'sa', character: 'さ', romaji: 'sa', type: 'hiragana', group: 's' },
  { id: 'shi', character: 'し', romaji: 'shi', type: 'hiragana', group: 's' },
  { id: 'su', character: 'す', romaji: 'su', type: 'hiragana', group: 's' },
  { id: 'se', character: 'せ', romaji: 'se', type: 'hiragana', group: 's' },
  { id: 'so', character: 'そ', romaji: 'so', type: 'hiragana', group: 's' },
  // Additional hiragana characters can be added here
];

/**
 * Complete collection of katakana characters with metadata
 */
export const katakanaData: Kana[] = [
  { id: 'A', character: 'ア', romaji: 'a', type: 'katakana', group: 'basic' },
  { id: 'I', character: 'イ', romaji: 'i', type: 'katakana', group: 'basic' },
  { id: 'U', character: 'ウ', romaji: 'u', type: 'katakana', group: 'basic' },
  { id: 'E', character: 'エ', romaji: 'e', type: 'katakana', group: 'basic' },
  { id: 'O', character: 'オ', romaji: 'o', type: 'katakana', group: 'basic' },
  { id: 'KA', character: 'カ', romaji: 'ka', type: 'katakana', group: 'k' },
  { id: 'KI', character: 'キ', romaji: 'ki', type: 'katakana', group: 'k' },
  { id: 'KU', character: 'ク', romaji: 'ku', type: 'katakana', group: 'k' },
  { id: 'KE', character: 'ケ', romaji: 'ke', type: 'katakana', group: 'k' },
  { id: 'KO', character: 'コ', romaji: 'ko', type: 'katakana', group: 'k' },
  { id: 'SA', character: 'サ', romaji: 'sa', type: 'katakana', group: 's' },
  { id: 'SHI', character: 'シ', romaji: 'shi', type: 'katakana', group: 's' },
  { id: 'SU', character: 'ス', romaji: 'su', type: 'katakana', group: 's' },
  { id: 'SE', character: 'セ', romaji: 'se', type: 'katakana', group: 's' },
  { id: 'SO', character: 'ソ', romaji: 'so', type: 'katakana', group: 's' },
  // Additional katakana characters can be added here
];

/**
 * Get all kana characters (both hiragana and katakana)
 */
export const getAllKana = (): Kana[] => {
  return [...hiraganaData, ...katakanaData];
};

/**
 * Get kana by type (hiragana or katakana)
 */
export const getKanaByType = (type: 'hiragana' | 'katakana'): Kana[] => {
  return type === 'hiragana' ? hiraganaData : katakanaData;
};

/**
 * Get kana by id
 */
export const getKanaById = (id: string): Kana | undefined => {
  return getAllKana().find(kana => kana.id === id);
};

/**
 * Get random kana characters
 */
export const getRandomKana = (count: number = 10, type?: 'hiragana' | 'katakana'): Kana[] => {
  const source = type ? getKanaByType(type) : getAllKana();
  
  // Shuffle the array and take the first 'count' elements
  return [...source]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, source.length));
};