import { KanaType } from "@prisma/client";

export interface Character {
  id: number;
  kana: string;
  romaji: string;
  type: KanaType;
  romanji: string;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserKanaPerformance {
  id: number;
  userId: string;
  kana: string;
  kanaType: string;
  correctCount: number;
  totalCount: number;
  lastPracticed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanaPerformanceData {
  kana: string;
  correctCount: number;
  totalCount: number;
  percentage: number;
  lastPracticed: Date;
}
