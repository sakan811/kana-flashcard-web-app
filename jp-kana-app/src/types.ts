/**
 * Main application types
 */

export interface Character {
  id?: number;
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

export interface KanaMessage {
  correct: string;
  incorrect: string;
  error: string;
}
