export type KanaType = "hiragana" | "katakana";

export interface Character {
  id?: number;
  kana: string;
  romanji: string;
  type: KanaType;
  weight: number;
}

export interface KanaMessage {
  correct: string;
  incorrect: string;
  error: string;
}

export interface KanaPerformanceData {
  kana: string;
  accuracy: number;
  correctCount: number;
  totalCount: number;
}

export interface UserKanaPerformance {
  id: number;
  userId: string;
  kana: string;
  kanaType: KanaType;
  correctCount: number;
  totalCount: number;
  lastPracticed: Date;
  createdAt: Date;
  updatedAt: Date;
}
