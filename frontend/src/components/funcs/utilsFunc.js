/**
 * Selects a random character from the provided data based on their weights.
 *
 * @param {Array} characterData - An array of objects representing characters.
 * Each object should have the following structure:
 *   - character: {string} - The Kana character, e.g., Katakana and Hiragana.
 *   - weight: {number} - The weight of the Katakana character.
 *
 * @returns {Object} - A random character object selected based on weight.
 * In case of rounding errors or unexpected situations, the last item is returned.
 */
const getRandomCharacter = (characterData) => {
  // Calculate the total weight by summing up the weights of all characters.
  const totalWeight = characterData.reduce((sum, { weight }) => sum + weight, 0);

  // Generate a random number between 0 and the total weight.
  let randomNum = Math.random() * totalWeight;

  // Iterate over the character data to find which character the random number falls into.
  for (const item of characterData) {
    // Subtract the weight of the current item from the random number.
    randomNum -= item.weight;
    // If the random number is now less than or equal to 0, return the current item.
    if (randomNum <= 0) {
      return item;
    }
  }

  // In case of rounding errors or unexpected situations, return the last item.
  return characterData[characterData.length - 1];
};


export { getRandomCharacter };