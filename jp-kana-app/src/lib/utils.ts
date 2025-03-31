import { Character } from "@/types/kana";
import { HIRAGANA_CHARACTERS, KATAKANA_CHARACTERS } from "@/constants";

/**
 * Selects a random character from the provided data based on their weights.
 * Characters with higher weights (lower accuracy) have a higher chance of being selected.
 *
 * @param {Character[]} characterData - An array of objects representing characters.
 * @returns {Character} - A random character object selected based on weight.
 */
export const getRandomCharacter = (
  characterData: Array<Character>,
): Character => {
  // Ensure all characters have valid weights
  const validCharacterData = characterData.map((char) => ({
    ...char,
    weight: isNaN(char.weight) || char.weight <= 0 ? 1 : char.weight,
  }));

  // Calculate the total weight by summing up the weights of all characters.
  const totalWeight: number = validCharacterData.reduce(
    (sum, { weight }) => sum + weight,
    0,
  );

  // Generate a random number between 0 and the total weight.
  let randomNum: number = Math.random() * totalWeight;

  // Iterate over the character data to find which character the random number falls into.
  for (const item of validCharacterData) {
    // Subtract the weight of the current item from the random number.
    randomNum -= item.weight;
    // If the random number is now less than or equal to 0, return the current item.
    if (randomNum <= 0) {
      return item;
    }
  }

  // In case of rounding errors or unexpected situations, return the last item.
  return validCharacterData[validCharacterData.length - 1];
};

/**
 * Returns a list of Hiragana characters, each with romanji and weight.
 *
 * @returns {Character[]} - A list of hiragana characters.
 */
export const getHiraganaList = (): Character[] => {
  return HIRAGANA_CHARACTERS;
};

/**
 * Returns a list of Katakana characters, each with romanji and weight.
 *
 * @returns {Character[]} - A list of katakana characters.
 */
export const getKatakanaList = (): Character[] => {
  return KATAKANA_CHARACTERS;
};
