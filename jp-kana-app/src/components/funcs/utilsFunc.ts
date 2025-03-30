// Define an interface for the character data objects
export interface Character {
  hiragana?: string;
  katakana?: string;
  romanji: string;
  weight: number;
}

// Define hiragana character list as a constant
const hiraganaList: Character[] = [
  { hiragana: "あ", romanji: "a", weight: 1 },
  { hiragana: "い", romanji: "i", weight: 1 },
  { hiragana: "う", romanji: "u", weight: 1 },
  { hiragana: "え", romanji: "e", weight: 1 },
  { hiragana: "お", romanji: "o", weight: 1 },
  { hiragana: "か", romanji: "ka", weight: 1 },
  { hiragana: "き", romanji: "ki", weight: 1 },
  { hiragana: "く", romanji: "ku", weight: 1 },
  { hiragana: "け", romanji: "ke", weight: 1 },
  { hiragana: "こ", romanji: "ko", weight: 1 },
  { hiragana: "さ", romanji: "sa", weight: 1 },
  { hiragana: "し", romanji: "shi", weight: 1 },
  { hiragana: "す", romanji: "su", weight: 1 },
  { hiragana: "せ", romanji: "se", weight: 1 },
  { hiragana: "そ", romanji: "so", weight: 1 },
  { hiragana: "た", romanji: "ta", weight: 1 },
  { hiragana: "ち", romanji: "chi", weight: 1 },
  { hiragana: "つ", romanji: "tsu", weight: 1 },
  { hiragana: "て", romanji: "te", weight: 1 },
  { hiragana: "と", romanji: "to", weight: 1 },
  { hiragana: "な", romanji: "na", weight: 1 },
  { hiragana: "に", romanji: "ni", weight: 1 },
  { hiragana: "ぬ", romanji: "nu", weight: 1 },
  { hiragana: "ね", romanji: "ne", weight: 1 },
  { hiragana: "の", romanji: "no", weight: 1 },
  { hiragana: "は", romanji: "ha", weight: 1 },
  { hiragana: "ひ", romanji: "hi", weight: 1 },
  { hiragana: "ふ", romanji: "fu", weight: 1 },
  { hiragana: "へ", romanji: "he", weight: 1 },
  { hiragana: "ほ", romanji: "ho", weight: 1 },
  { hiragana: "ま", romanji: "ma", weight: 1 },
  { hiragana: "み", romanji: "mi", weight: 1 },
  { hiragana: "む", romanji: "mu", weight: 1 },
  { hiragana: "め", romanji: "me", weight: 1 },
  { hiragana: "も", romanji: "mo", weight: 1 },
  { hiragana: "や", romanji: "ya", weight: 1 },
  { hiragana: "ゆ", romanji: "yu", weight: 1 },
  { hiragana: "よ", romanji: "yo", weight: 1 },
  { hiragana: "ら", romanji: "ra", weight: 1 },
  { hiragana: "り", romanji: "ri", weight: 1 },
  { hiragana: "る", romanji: "ru", weight: 1 },
  { hiragana: "れ", romanji: "re", weight: 1 },
  { hiragana: "ろ", romanji: "ro", weight: 1 },
  { hiragana: "わ", romanji: "wa", weight: 1 },
  { hiragana: "を", romanji: "wo", weight: 1 },
  { hiragana: "ん", romanji: "n", weight: 1 },
];

// Define katakana character list as a constant
const katakanaList: Character[] = [
  { katakana: "ア", romanji: "a", weight: 1 },
  { katakana: "イ", romanji: "i", weight: 1 },
  { katakana: "ウ", romanji: "u", weight: 1 },
  { katakana: "エ", romanji: "e", weight: 1 },
  { katakana: "オ", romanji: "o", weight: 1 },
  { katakana: "カ", romanji: "ka", weight: 1 },
  { katakana: "キ", romanji: "ki", weight: 1 },
  { katakana: "ク", romanji: "ku", weight: 1 },
  { katakana: "ケ", romanji: "ke", weight: 1 },
  { katakana: "コ", romanji: "ko", weight: 1 },
  { katakana: "サ", romanji: "sa", weight: 1 },
  { katakana: "シ", romanji: "shi", weight: 1 },
  { katakana: "ス", romanji: "su", weight: 1 },
  { katakana: "セ", romanji: "se", weight: 1 },
  { katakana: "ソ", romanji: "so", weight: 1 },
  { katakana: "タ", romanji: "ta", weight: 1 },
  { katakana: "チ", romanji: "chi", weight: 1 },
  { katakana: "ツ", romanji: "tsu", weight: 1 },
  { katakana: "テ", romanji: "te", weight: 1 },
  { katakana: "ト", romanji: "to", weight: 1 },
  { katakana: "ナ", romanji: "na", weight: 1 },
  { katakana: "ニ", romanji: "ni", weight: 1 },
  { katakana: "ヌ", romanji: "nu", weight: 1 },
  { katakana: "ネ", romanji: "ne", weight: 1 },
  { katakana: "ノ", romanji: "no", weight: 1 },
  { katakana: "ハ", romanji: "ha", weight: 1 },
  { katakana: "ヒ", romanji: "hi", weight: 1 },
  { katakana: "フ", romanji: "fu", weight: 1 },
  { katakana: "ヘ", romanji: "he", weight: 1 },
  { katakana: "ホ", romanji: "ho", weight: 1 },
  { katakana: "マ", romanji: "ma", weight: 1 },
  { katakana: "ミ", romanji: "mi", weight: 1 },
  { katakana: "ム", romanji: "mu", weight: 1 },
  { katakana: "メ", romanji: "me", weight: 1 },
  { katakana: "モ", romanji: "mo", weight: 1 },
  { katakana: "ヤ", romanji: "ya", weight: 1 },
  { katakana: "ユ", romanji: "yu", weight: 1 },
  { katakana: "ヨ", romanji: "yo", weight: 1 },
  { katakana: "ラ", romanji: "ra", weight: 1 },
  { katakana: "リ", romanji: "ri", weight: 1 },
  { katakana: "ル", romanji: "ru", weight: 1 },
  { katakana: "レ", romanji: "re", weight: 1 },
  { katakana: "ロ", romanji: "ro", weight: 1 },
  { katakana: "ワ", romanji: "wa", weight: 1 },
  { katakana: "ヲ", romanji: "wo", weight: 1 },
  { katakana: "ン", romanji: "n", weight: 1 },
];

/**
 * Stores all kana characters in localStorage for use in other components
 */
export const storeKanaCharacters = (): void => {
  if (typeof window !== 'undefined') {
    const allKana = [...hiraganaList, ...katakanaList];
    
    try {
      localStorage.setItem('kanaCharacters', JSON.stringify(allKana));
    } catch (error) {
      console.error('Error storing kana characters in localStorage:', error);
    }
  }
};

/**
 * Selects a random character from the provided data based on their weights.
 *
 * @param {Character[]} characterData - An array of objects representing characters.
 * Each object should have the following structure:
 *   - hiragana or katakana: string - The Kana character (either hiragana or katakana).
 *   - romanji: string - The romanized version of the character.
 *   - weight: number - The weight associated with the character.
 *
 * @returns {Character} - A random character object selected based on weight.
 * In case of rounding errors or unexpected situations, the last item is returned.
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
  // Initialize localStorage if needed
  if (typeof window !== 'undefined' && !localStorage.getItem('kanaCharacters')) {
    storeKanaCharacters();
  }
  
  return hiraganaList;
};

/**
 * Returns a list of Katakana characters, each with romanji and weight.
 *
 * @returns {Character[]} - A list of katakana characters.
 */
export const getKatakanaList = (): Character[] => {
  // Initialize localStorage if needed
  if (typeof window !== 'undefined' && !localStorage.getItem('kanaCharacters')) {
    storeKanaCharacters();
  }
  
  return katakanaList;
};

