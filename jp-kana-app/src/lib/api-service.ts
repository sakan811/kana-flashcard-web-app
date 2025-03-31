/**
 * API service for interacting with the backend from browser environments
 */
import { Character, KanaPerformanceData } from "@/types/kana";
import { CACHE_DURATION } from "../constants";

// Simple cache for performance data
interface CacheEntry {
  data: KanaPerformanceData[];
  timestamp: number;
}

const performanceCache: Record<string, CacheEntry> = {};

const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Fetch a random kana based on user performance
 * Kana with lower accuracy will have a higher probability of being selected
 */
export async function getRandomKana(
  userId: string,
  kanaType: "hiragana" | "katakana",
): Promise<Character> {
  try {
    const response = await fetchWithCredentials(
      `/api/random-kana?userId=${encodeURIComponent(userId)}&kanaType=${kanaType}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Failed to fetch random kana: ${response.statusText}`,
      );
    }

    const responseData = await response.json();

    if (!responseData.success) {
      throw new Error(
        responseData.error || "Unknown error fetching random kana",
      );
    }

    return responseData.data as Character;
  } catch (error) {
    console.error("Error fetching random kana:", error);
    throw error;
  }
}

/**
 * Get performance data for kana characters
 */
export async function getKanaPerformance(
  userId: string,
  kanaType: "hiragana" | "katakana",
): Promise<KanaPerformanceData[]> {
  const cacheKey = `${userId}-${kanaType}`;
  const now = Date.now();

  if (
    performanceCache[cacheKey] &&
    now - performanceCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return performanceCache[cacheKey].data;
  }

  try {
    const response = await fetchWithCredentials(
      `/api/kana-performance?userId=${userId}&kanaType=${kanaType}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch kana performance: ${response.statusText}`,
      );
    }

    const data = await response.json();
    performanceCache[cacheKey] = {
      data,
      timestamp: now,
    };

    return data;
  } catch (error) {
    console.error(`Error fetching ${kanaType} performance:`, error);
    throw error;
  }
}

/**
 * Invalidate cache after recording an answer
 */
function invalidateCache(
  userId: string,
  kanaType: "hiragana" | "katakana",
): void {
  const cacheKey = `${userId}-${kanaType}`;
  delete performanceCache[cacheKey];
}

/**
 * Record user's answer for a kana character
 */
export async function recordKanaPerformance(
  userId: string,
  kana: string,
  kanaType: "hiragana" | "katakana",
  isCorrect: boolean,
  flashcardId?: number,
): Promise<void> {
  try {
    const response = await fetchWithCredentials(`/api/record-performance`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        kana,
        kanaType,
        isCorrect,
        flashcardId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to record kana performance: ${response.statusText}`,
      );
    }

    invalidateCache(userId, kanaType);
  } catch (error) {
    console.error("Error recording kana performance:", error);
    throw error;
  }
}

/**
 * Get kana weights based on performance
 */
export async function getKanaWithWeights(
  characters: Character[],
  userId: string,
  kanaType: "hiragana" | "katakana",
): Promise<Character[]> {
  try {
    const response = await fetchWithCredentials(`/api/kana-weights`, {
      method: "POST",
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
    console.error("Error getting kana weights:", error);
    throw error;
  }
}
