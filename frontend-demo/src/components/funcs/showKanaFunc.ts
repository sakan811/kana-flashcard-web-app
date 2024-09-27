import {Character} from "@/components/funcs/utilsFunc";

export interface PerformanceData {
  kana?: string;
  romanji: string;
  correct_answer: number;
  total_answer: number;
  accuracy: number;
}

/**
 * Initializes performance data for Kana characters based on the type specified (hiragana or katakana).
 *
 * @param kanaType - A string representing the type of Kana. It should be either 'hiragana' or 'katakana'.
 * @param initialKanaCharacters - An array of initial Kana characters. Each character must include hiragana, katakana,
 *                                and romanji properties.
 * @returns An array of performance data objects, each containing:
 *   - kana: The Kana character (either hiragana or katakana based on kanaType).
 *   - romanji: The Romanji representation of the Kana character.
 *   - correct_answer: The number of correct answers (initialized to 0).
 *   - total_answer: The total number of answers (initialized to 0).
 *   - accuracy: The accuracy percentage (initialized to 0).
 */
export const initializeKanaPerformanceData = (
    kanaType: 'hiragana' | 'katakana' | undefined,
    initialKanaCharacters: Character[]
): PerformanceData[] => {
    return initialKanaCharacters.map((char) => ({
        kana: kanaType === 'hiragana' ? char.hiragana : kanaType === 'katakana' ? char.katakana : undefined,
        romanji: char.romanji,
        correct_answer: 0,
        total_answer: 0,
        accuracy: 0,
    }));
};