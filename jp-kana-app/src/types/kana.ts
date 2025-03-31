export enum KanaType {
  hiragana = "hiragana",
  katakana = "katakana"
}

export interface Character {
  id?: number;
  kana?: string;
  hiragana?: string;
  katakana?: string;
  romaji: string;
  type?: KanaType;
  weight: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface KanaMessage {
  correct: string;
  incorrect: string;
  error: string;
}

export interface KanaPerformanceData {
  id: number;
  userId: string;
  kana: string;
  kanaType: KanaType;
  correctCount: number;
  totalCount: number;
  accuracy: number;
  percentage: number;
  lastPracticed: Date;
  createdAt: Date;
  updatedAt: Date;
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
