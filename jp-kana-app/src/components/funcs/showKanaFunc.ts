import { Character, KanaPerformanceData } from '../../types';
import { DEFAULT_USER_ID } from '../../constants';
import { 
  getKanaPerformance, 
  recordKanaPerformance as apiRecordPerformance
} from '../../lib/api-service';

/**
 * Update each Kana's weight.
 *
 * @param {Character[]} initialKanaCharacters - Initial Kana Weight
 * @param {"hiragana" | "katakana" | undefined} kanaType - Japanese Kana Type, e.g., Hiragana or Katakana.
 * @returns {Promise<Character[]>} - A list of Kana with updated weight.
 * @throws {Error} If there is an issue with the database connection
 */
export const updateKanaWeight = async (
    initialKanaCharacters: Array<Character>,
    kanaType: "hiragana" | "katakana" | undefined
): Promise<Character[]> => {
  // Default to hiragana if kanaType is undefined
  const type: "hiragana" | "katakana" = kanaType || 'hiragana';

  try {
    // Get performance data through the API service
    const performanceData = await getKanaPerformance(DEFAULT_USER_ID, type);

    try {
      // Update weights based on the fetched data
      return updateWeights(initialKanaCharacters, performanceData, type);
    } catch (updateError) {
      console.error("Error updating weights for %s:", type, updateError);
      // Re-throw the error to be handled by the caller
      throw updateError;
    }
  } catch (fetchError) {
    console.error("Error fetching %s data:", type, fetchError);
    // Re-throw the error to be handled by the caller
    throw fetchError;
  }
};

/**
 * Update weight of each Kana.
 * @param {Character[]} initialKanaCharacters - Initial array of Kana objects with their default weights.
 * @param {KanaPerformanceData[]} performanceData - Array of objects containing user performance data for each Kana from the database.
 * @param {"hiragana" | "katakana"} kanaType - The type of Kana (e.g., 'Hiragana' or 'Katakana') that is being processed.
 * @returns {Character[]} - A new array of Kana objects with the updated weight values.
 */
export function updateWeights(
    initialKanaCharacters: Character[],
    performanceData: KanaPerformanceData[],
    kanaType: "hiragana" | "katakana"
): Character[] {
    // Use map to iterate over each Kana character in the initial array
    return initialKanaCharacters.map((char: Character): Character => {
      // Find the corresponding data item in the performance data
      const dataItem = performanceData.find(
        item => item.kana === (kanaType === 'hiragana' ? char.hiragana : char.katakana)
      );

    // If a matching data item is found, calculate the new weight
    if (dataItem) {
      // Weight is calculated based on the user's performance: higher percentage means lower weight
      const userPerformance: number = (100 - dataItem.accuracy) / 10;
      // We use Math.max to ensure the weight is at least 1
      const weight: number = Math.max(1, userPerformance);

      // Return a new object with all original properties of the Kana character, but with the updated weight
      return { ...char, weight };
    }

    // If no matching data item is found, return the original Kana character without changes
    return char;
  });
}

/**
 * Submit users' answer to the database
 * @param {"hiragana" | "katakana" | undefined} kanaType - The type of Kana (e.g., 'Hiragana' or 'Katakana') that is being processed.
 * @param {string} inputValue - Users' answer of the displayed Kana as a Romanji.
 * @param {Character} currentKana - Currently displayed Kana.
 * @param {boolean} isCorrect - Whether the answer is correct.
 * @returns {Promise<void>}
 * @throws {Error} If there is an issue with the database connection
 */
export const submitAnswer = async (
    kanaType: "hiragana" | "katakana" | undefined,
    inputValue: string,
    currentKana: Character,
    isCorrect: boolean
): Promise<void> => {
  // Get the kana character based on type (defaulting to hiragana if undefined)
  const effectiveType: "hiragana" | "katakana" = kanaType || 'hiragana';
  const kana = effectiveType === 'hiragana' ? currentKana.hiragana : currentKana.katakana;
  
  // Skip if kana is undefined
  if (!kana) {
    const error = new Error('Kana is undefined, cannot record performance');
    console.error(error);
    throw error;
  }
  
  // Record the performance using the API service (will throw if there's an error)
  await apiRecordPerformance(
    DEFAULT_USER_ID,
    kana,
    effectiveType,
    isCorrect,
    currentKana.id // Pass the flashcard ID if available
  );
}