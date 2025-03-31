import { Character, KanaType } from "@/types/kana";
import { recordKanaPerformance } from "./api-service";
import { DEFAULT_USER_ID } from "../constants";

/**
 * Updates the weight of kana characters based on user performance
 *
 * @param initialCharacters List of kana characters
 * @param kanaType The type of kana (hiragana or katakana)
 * @returns Updated character weights
 */
export async function updateKanaWeight(
  characters: Character[],
): Promise<Character[]> {
  try {
    return characters.map((char) => ({
      ...char,
      weight: Math.random() * 2 + 1, // Random weight between 1-3
    }));
  } catch (error) {
    console.error("Error updating kana weights:", error);
    return characters;
  }
}

/**
 * Submits an answer for a flashcard and records the result
 *
 * @param kanaType The type of kana (hiragana or katakana)
 * @param inputValue The user's input answer
 * @param currentKana The current kana character
 * @param isCorrect Whether the answer was correct
 */
export async function submitAnswer(
  kanaType: KanaType | undefined,
  answer: string,
  currentKana: Character,
  isCorrect: boolean,
): Promise<void> {
  try {
    await recordKanaPerformance(
      DEFAULT_USER_ID,
      currentKana.kana || "",
      kanaType || KanaType.hiragana,
      isCorrect,
      currentKana.id,
    );
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
}
