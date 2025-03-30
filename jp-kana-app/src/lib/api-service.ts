/**
 * API service for interacting with the backend from browser environments
 */
import { Character } from '../types';

// No need for API_BASE_URL with Next.js App Router - APIs are relative to the base URL
export interface KanaPerformanceData {
  kana: string;
  kanaType: string;
  correctCount: number;
  totalCount: number;
  accuracy: number;
}

/**
 * Get performance data for kana characters
 */
export async function getKanaPerformance(
  userId: string,
  kanaType: 'hiragana' | 'katakana'
): Promise<KanaPerformanceData[]> {
  try {
    const response = await fetch(`/api/kana-performance?userId=${userId}&kanaType=${kanaType}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch kana performance: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${kanaType} performance:`, error);
    throw error;
  }
}

/**
 * Record user's answer for a kana character
 */
export async function recordKanaPerformance(
  userId: string,
  kana: string,
  kanaType: 'hiragana' | 'katakana',
  isCorrect: boolean
): Promise<void> {
  try {
    const response = await fetch(`/api/record-performance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        kana,
        kanaType,
        isCorrect,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to record kana performance: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error recording kana performance:', error);
    throw error;
  }
}

/**
 * Get kana weights based on performance
 */
export async function getKanaWithWeights(
  characters: Character[],
  userId: string,
  kanaType: 'hiragana' | 'katakana'
): Promise<Character[]> {
  try {
    const response = await fetch(`/api/kana-weights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        kanaType,
        characters,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get kana weights: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting kana weights:', error);
    throw error;
  }
} 