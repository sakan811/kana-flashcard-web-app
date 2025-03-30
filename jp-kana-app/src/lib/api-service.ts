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
    // For development without a backend, return mock data
    if (typeof window !== 'undefined' && localStorage.getItem('USE_MOCK_DATA') === 'true') {
      return getMockKanaPerformance(kanaType);
    }
    
    const response = await fetch(`/api/kana-performance?userId=${userId}&kanaType=${kanaType}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch kana performance: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${kanaType} performance:`, error);
    // Fall back to mock data in case of error
    if (typeof window !== 'undefined') {
      return getMockKanaPerformance(kanaType);
    }
    return [];
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
    // For development without a backend, store in localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('USE_MOCK_DATA') === 'true') {
      recordMockKanaPerformance(userId, kana, kanaType, isCorrect);
      return;
    }
    
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
    // Fall back to localStorage in case of error
    if (typeof window !== 'undefined') {
      recordMockKanaPerformance(userId, kana, kanaType, isCorrect);
    }
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
    // For development without a backend, use local calculation
    if (typeof window !== 'undefined' && localStorage.getItem('USE_MOCK_DATA') === 'true') {
      return getMockKanaWithWeights(characters, kanaType);
    }
    
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
    // Fall back to local calculation in case of error
    if (typeof window !== 'undefined') {
      return getMockKanaWithWeights(characters, kanaType);
    }
    return characters;
  }
}

// Mock data functions for development without a backend
function getMockKanaPerformance(kanaType: 'hiragana' | 'katakana'): KanaPerformanceData[] {
  const storageKey = `kana_performance_${kanaType}`;
  const storedData = localStorage.getItem(storageKey);
  
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  return [];
}

function recordMockKanaPerformance(
  userId: string,
  kana: string,
  kanaType: 'hiragana' | 'katakana',
  isCorrect: boolean
): void {
  const storageKey = `kana_performance_${kanaType}`;
  const storedData = localStorage.getItem(storageKey);
  let performances: KanaPerformanceData[] = storedData ? JSON.parse(storedData) : [];
  
  const existingIndex = performances.findIndex(p => p.kana === kana);
  
  if (existingIndex >= 0) {
    // Update existing record
    performances[existingIndex].totalCount += 1;
    if (isCorrect) {
      performances[existingIndex].correctCount += 1;
    }
    performances[existingIndex].accuracy = (performances[existingIndex].correctCount / performances[existingIndex].totalCount) * 100;
  } else {
    // Create new record
    performances.push({
      kana,
      kanaType,
      correctCount: isCorrect ? 1 : 0,
      totalCount: 1,
      accuracy: isCorrect ? 100 : 0,
    });
  }
  
  localStorage.setItem(storageKey, JSON.stringify(performances));
}

function getMockKanaWithWeights(characters: Character[], kanaType: 'hiragana' | 'katakana'): Character[] {
  const storageKey = `kana_performance_${kanaType}`;
  const storedData = localStorage.getItem(storageKey);
  const performances: KanaPerformanceData[] = storedData ? JSON.parse(storedData) : [];
  
  return characters.map(char => {
    const kanaValue = kanaType === 'hiragana' ? char.hiragana : char.katakana;
    const performance = performances.find(p => p.kana === kanaValue);
    
    if (performance) {
      const accuracy = performance.accuracy || 0;
      // Weight is inversely proportional to accuracy - less accurate characters appear more often
      const weight = 1 + ((100 - accuracy) / 25);
      return { ...char, weight };
    }
    
    return char;
  });
}

// Enable mock mode for development by default - safely check for browser environment first
if (typeof window !== 'undefined' && localStorage.getItem('USE_MOCK_DATA') === null) {
  localStorage.setItem('USE_MOCK_DATA', 'true');
} 