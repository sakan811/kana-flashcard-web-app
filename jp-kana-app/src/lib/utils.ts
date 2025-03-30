// Define an interface for the character data objects
export interface Character {
  hiragana?: string;
  katakana?: string;
  romanji: string;
  weight: number;
}

/**
 * Selects a random character from the provided data based on their weights.
 *
 * @param {Character[]} characterData - An array of objects representing characters.
 * @returns {Character} - A random character object selected based on weight.
 */
export const getRandomCharacter = (characterData: Array<Character>): Character => {
  // Calculate the total weight by summing up the weights of all characters.
  const totalWeight: number = characterData.reduce((sum, { weight }) => sum + weight, 0);

  // Generate a random number between 0 and the total weight.
  let randomNum: number = Math.random() * totalWeight;

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

/**
 * Returns a list of Hiragana characters, each with romanji and weight.
 *
 * @returns {Character[]} - A list of hiragana characters.
 */
export const getHiraganaList = (): Character[] => {
  return [
    { hiragana: "あ", romanji: "a", weight: 1 },
    { hiragana: "い", romanji: "i", weight: 1 },
    { hiragana: "う", romanji: "u", weight: 1 },
    { hiragana: "え", romanji: "e", weight: 1 },
    { hiragana: "お", romanji: "o", weight: 1 },
    // More characters...
    { hiragana: "か", romanji: "ka", weight: 1 },
    { hiragana: "き", romanji: "ki", weight: 1 },
    { hiragana: "く", romanji: "ku", weight: 1 },
    { hiragana: "け", romanji: "ke", weight: 1 },
    { hiragana: "こ", romanji: "ko", weight: 1 },
    // Add the rest as needed
    { hiragana: "ん", romanji: "n", weight: 1 },
  ];
};

/**
 * Returns a list of Katakana characters, each with romanji and weight.
 *
 * @returns {Character[]} - A list of katakana characters.
 */
export const getKatakanaList = (): Character[] => {
  return [
    { katakana: "ア", romanji: "a", weight: 1 },
    { katakana: "イ", romanji: "i", weight: 1 },
    { katakana: "ウ", romanji: "u", weight: 1 },
    { katakana: "エ", romanji: "e", weight: 1 },
    { katakana: "オ", romanji: "o", weight: 1 },
    // More characters...
    { katakana: "カ", romanji: "ka", weight: 1 },
    { katakana: "キ", romanji: "ki", weight: 1 },
    { katakana: "ク", romanji: "ku", weight: 1 },
    { katakana: "ケ", romanji: "ke", weight: 1 },
    { katakana: "コ", romanji: "ko", weight: 1 },
    // Add the rest as needed
    { katakana: "ン", romanji: "n", weight: 1 },
  ];
}; 