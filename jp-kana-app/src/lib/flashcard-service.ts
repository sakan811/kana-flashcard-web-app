import { Character } from './utils';
import { 
  getKanaWithWeights as fetchKanaWithWeights,
  recordKanaPerformance as recordPerformance
} from './api-service';
import { DEFAULT_USER_ID } from '../constants';

/**
 * Updates the weight of kana characters based on user performance
 * 
 * @param initialCharacters List of kana characters
 * @param kanaType The type of kana (hiragana or katakana)
 * @returns Updated character weights
 */
export async function updateKanaWeight(
  initialCharacters: Character[], 
  kanaType?: 'hiragana' | 'katakana'
): Promise<Character[]> {
  // Default to hiragana if undefined
  const effectiveType: 'hiragana' | 'katakana' = kanaType || 'hiragana';
  
  try {
    // Use API service to get kana with weights
    return await fetchKanaWithWeights(initialCharacters, DEFAULT_USER_ID, effectiveType);
  } catch (error) {
    console.error(`Error updating kana weights:`, error);
    return initialCharacters;
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
  kanaType: 'hiragana' | 'katakana' | undefined, 
  inputValue: string, 
  currentKana: Character, 
  isCorrect: boolean
): Promise<void> {
  // Default to hiragana if undefined
  const effectiveType: 'hiragana' | 'katakana' = kanaType || 'hiragana';
  
  try {
    // Store performance data using API service
    const kana = effectiveType === 'hiragana' ? currentKana.hiragana : currentKana.katakana;
    
    // Skip if kana is undefined
    if (!kana) {
      console.error('Kana is undefined, cannot record performance');
      return;
    }
    
    await recordPerformance(
      DEFAULT_USER_ID, 
      kana,
      effectiveType,
      isCorrect
    );
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
} 