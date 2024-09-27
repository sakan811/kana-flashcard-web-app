import axios from 'axios';
import {Character} from "@/components/funcs/utilsFunc";

interface ServerData {
  [key: string]: unknown;
  correct_percentage: number;
}

/**
 * Update each Kana's weight.
 *
 * @param {Character[]} initialKanaCharacters - Initial Kana Weight
 * @param {"hiragana" | "katakana" | undefined} kanaType - Japanese Kana Type, e.g., Hiragana or Katakana.
 * @returns {Promise<Character[]>} - A list of Kana with updated weight.
 */
export const updateKanaWeight = async (
    initialKanaCharacters: Array<Character>,
    kanaType: "hiragana" | "katakana" | undefined
): Promise<Character[]> => {
  if (!kanaType) {
     kanaType = 'hiragana';
  }

  try {
    // Fetch the kana percentages from the server
    const response = await axios.get(`http://localhost:5000/${kanaType}-percentages`);
    const data: ServerData[] = response.data;

    try {
      // Update weights based on the fetched data
      return updateWeights(initialKanaCharacters, data, kanaType);
    } catch (updateError) {
      console.error(`Error updating weights for ${kanaType}:`, updateError);
      // Return the original list with initial weights if weight update fails
      return initialKanaCharacters;
    }
  } catch (fetchError) {
    console.error(`Error fetching ${kanaType} data:`, fetchError);
    // Return the original list with initial weights if fetch fails
    return initialKanaCharacters;
  }
};

/**
 * Update weight of each Kana.
 * @param {Character[]} initialKanaCharacters - Initial array of Kana objects with their default weights.
 * @param {ServerData[]} serverData - Array of objects containing user performance data for each Kana from the database.
 * @param {"hiragana" | "katakana"} kanaType - The type of Kana (e.g., 'Hiragana' or 'Katakana') that is being processed.
 * @returns {Character[]} - A new array of Kana objects with the updated weight values.
 */
export function updateWeights(
    initialKanaCharacters: Character[],
    serverData: ServerData[],
    kanaType: "hiragana" | "katakana"
): Character[] {
    // Use map to iterate over each Kana character in the initial array
    return initialKanaCharacters.map((char: Character): Character => {
      // Find the corresponding data item in the server data using the kanaType key
      const dataItem: ServerData | undefined = serverData.find((item: ServerData): boolean => {
        return item[kanaType] === (char as never)[kanaType];
      });

    // If a matching data item is found, calculate the new weight
    if (dataItem) {
      // Weight is calculated based on the user's performance: higher percentage means lower weight
      const userPerformance: number = (100 - dataItem.correct_percentage) / 10;
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
 */
export const submitAnswer = async (
    kanaType: "hiragana" | "katakana" | undefined,
    inputValue: string,
    currentKana: Character,
    isCorrect: boolean
): Promise<void> => {
  if (!kanaType) {
     kanaType = 'hiragana';
  }

  await axios.post(`http://localhost:5000/${kanaType}-answer/`, {
    answer: inputValue,
    [kanaType]: (currentKana as never)[kanaType],
    romanji: currentKana.romanji,
    is_correct: isCorrect
  });
}