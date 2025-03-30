/**
 * Main application types
 */

export interface Character {
  hiragana?: string;
  katakana?: string;
  romanji: string;
  weight: number;
}

export interface KanaPerformanceData {
  kana: string;
  kanaType: string;
  correctCount: number;
  totalCount: number;
  accuracy: number;
} 