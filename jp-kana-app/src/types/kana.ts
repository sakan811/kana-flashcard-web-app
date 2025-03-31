export interface Character {
  hiragana?: string;
  katakana?: string;
  romanji: string;
  weight: number;
}

export interface KanaMessage {
  correct: string;
  incorrect: string;
  error: string;
}

export interface KanaPerformanceData {
  hiragana?: string;
  katakana?: string;
  romanji?: string;
  correctCount: number;
  totalCount: number;
  accuracy: number;
}

export type KanaType = "hiragana" | "katakana";
