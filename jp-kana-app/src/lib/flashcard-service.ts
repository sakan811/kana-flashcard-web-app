import { Character, KanaType } from "@/types/kana";
import { recordKanaPerformance } from "./api-service";

/**
 * Submits an answer for a flashcard and records the result
 *
 * @param userId The ID of the authenticated user
 * @param kanaType The type of kana (hiragana or katakana)
 * @param inputValue The user's input answer
 * @param currentKana The current kana character
 * @param isCorrect Whether the answer was correct
 */
export async function submitAnswer(
  userId: string,
  kanaType: KanaType | undefined,
  answer: string,
  currentKana: Character,
  isCorrect: boolean,
): Promise<void> {
  try {
    await recordKanaPerformance(
      userId,
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
