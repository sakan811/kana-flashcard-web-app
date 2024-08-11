import axios from 'axios';


/**
 * Update each Kana's weight.
 *
 * @param {Array} initialKanaCharacters - Initial Kana Weight
 * @param {String} kanaType - Japanese Kana Type, e.g., Hiragana or Katakana.
 * @returns {Promise<Array>} - A list of Kana with updated weight.
 */
export const updateKanaWeight = async (
    initialKanaCharacters: Array<object>,
    kanaType: string
): Promise<Array<object>> => {
    try {
        // Fetch the kana percentages from the server
        const response = await axios.get(`http://localhost:5000/${kanaType}-percentages`);
        const data: Array<object> = response.data;

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
 * @param {Array} initialKanaCharacters - Initial array of Kana objects with their default weights.
 * @param {Object} serverData - Array of objects containing user performance data for each Kana from the database.
 * @param {String} kanaType - The type of Kana (e.g., 'Hiragana' or 'Katakana') that is being processed.
 * @returns {Array} - A new array of Kana objects with the updated weight values.
 */
function updateWeights(
    initialKanaCharacters: Array<object>,
    serverData: Array<object>,
    kanaType: string
): Array<object>{
  // Use map to iterate over each Kana character in the initial array
  return initialKanaCharacters.map(function(char: object): object {

    // Find the corresponding data item in the server data using the kanaType key
    const dataItem: object = serverData.find(function(item: object): boolean {
      return item[kanaType] === char[kanaType];
    });

    // If a matching data item is found, calculate the new weight
    if (dataItem) {
      // Weight is calculated based on the user's performance: higher percentage means lower weight
      const userPerformance: number = (100 - dataItem.correct_percentage) / 10
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
 * @param {String} kanaType - The type of Kana (e.g., 'Hiragana' or 'Katakana') that is being processed.
 * @param {String} inputValue - Users' answer of the displayed Kana as a Romanji.
 * @param {Object} currentKana - Currently displayed Kana.
 * @param {Boolean} isCorrect - Whether the answer is correct.
 * @returns {Promise<void>}
 */
export const submitAnswer = async (
    kanaType: string,
    inputValue: string,
    currentKana: object,
    isCorrect: boolean
): Promise<void> => {
      await axios.post(`http://localhost:5000/${kanaType}-answer/`, {
        answer: inputValue,
        [kanaType]: currentKana[kanaType],
        romanji: currentKana.romanji,
        is_correct: isCorrect
      });
}




