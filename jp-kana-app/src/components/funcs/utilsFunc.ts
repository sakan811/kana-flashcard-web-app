// Define an interface for the character data objects
export interface Character {
  hiragana?: string;
  katakana?: string;
  romanji: string;
  weight: number;
}

// Define hiragana character list as a constant
const hiraganaList: Character[] = [
  // Basic vowels (a, i, u, e, o)
  { hiragana: "あ", romanji: "a", weight: 1 },
  { hiragana: "い", romanji: "i", weight: 1 },
  { hiragana: "う", romanji: "u", weight: 1 },
  { hiragana: "え", romanji: "e", weight: 1 },
  { hiragana: "お", romanji: "o", weight: 1 },
  
  // K-row (ka, ki, ku, ke, ko)
  { hiragana: "か", romanji: "ka", weight: 1 },
  { hiragana: "き", romanji: "ki", weight: 1 },
  { hiragana: "く", romanji: "ku", weight: 1 },
  { hiragana: "け", romanji: "ke", weight: 1 },
  { hiragana: "こ", romanji: "ko", weight: 1 },
  
  // S-row (sa, shi, su, se, so)
  { hiragana: "さ", romanji: "sa", weight: 1 },
  { hiragana: "し", romanji: "shi", weight: 1 },
  { hiragana: "す", romanji: "su", weight: 1 },
  { hiragana: "せ", romanji: "se", weight: 1 },
  { hiragana: "そ", romanji: "so", weight: 1 },
  
  // T-row (ta, chi, tsu, te, to)
  { hiragana: "た", romanji: "ta", weight: 1 },
  { hiragana: "ち", romanji: "chi", weight: 1 },
  { hiragana: "つ", romanji: "tsu", weight: 1 },
  { hiragana: "て", romanji: "te", weight: 1 },
  { hiragana: "と", romanji: "to", weight: 1 },
  
  // N-row (na, ni, nu, ne, no)
  { hiragana: "な", romanji: "na", weight: 1 },
  { hiragana: "に", romanji: "ni", weight: 1 },
  { hiragana: "ぬ", romanji: "nu", weight: 1 },
  { hiragana: "ね", romanji: "ne", weight: 1 },
  { hiragana: "の", romanji: "no", weight: 1 },
  
  // H-row (ha, hi, fu, he, ho)
  { hiragana: "は", romanji: "ha", weight: 1 },
  { hiragana: "ひ", romanji: "hi", weight: 1 },
  { hiragana: "ふ", romanji: "fu", weight: 1 },
  { hiragana: "へ", romanji: "he", weight: 1 },
  { hiragana: "ほ", romanji: "ho", weight: 1 },
  
  // M-row (ma, mi, mu, me, mo)
  { hiragana: "ま", romanji: "ma", weight: 1 },
  { hiragana: "み", romanji: "mi", weight: 1 },
  { hiragana: "む", romanji: "mu", weight: 1 },
  { hiragana: "め", romanji: "me", weight: 1 },
  { hiragana: "も", romanji: "mo", weight: 1 },
  
  // Y-row (ya, yu, yo)
  { hiragana: "や", romanji: "ya", weight: 1 },
  { hiragana: "ゆ", romanji: "yu", weight: 1 },
  { hiragana: "よ", romanji: "yo", weight: 1 },
  
  // R-row (ra, ri, ru, re, ro)
  { hiragana: "ら", romanji: "ra", weight: 1 },
  { hiragana: "り", romanji: "ri", weight: 1 },
  { hiragana: "る", romanji: "ru", weight: 1 },
  { hiragana: "れ", romanji: "re", weight: 1 },
  { hiragana: "ろ", romanji: "ro", weight: 1 },
  
  // W-row (wa, wi, we, wo)
  { hiragana: "わ", romanji: "wa", weight: 1 },
  { hiragana: "ゐ", romanji: "wi", weight: 1 }, // Obsolete character
  { hiragana: "ゑ", romanji: "we", weight: 1 }, // Obsolete character
  { hiragana: "を", romanji: "wo", weight: 1 },
  
  // Singular N
  { hiragana: "ん", romanji: "n", weight: 1 },
  
  // Functional marks and diacritics
  { hiragana: "っ", romanji: "tsu (small)", weight: 1 }, // Small tsu (consonant gemination)
  { hiragana: "ゝ", romanji: "iteration mark", weight: 1 }, // Iteration mark (repeats previous kana)
  
  // Dakuten and handakuten are usually added to other kana, but we'll include them as educational items
  
  // Dakuten (voiced) variants
  { hiragana: "が", romanji: "ga", weight: 1 }, // か + dakuten
  { hiragana: "ぎ", romanji: "gi", weight: 1 }, // き + dakuten
  { hiragana: "ぐ", romanji: "gu", weight: 1 }, // く + dakuten
  { hiragana: "げ", romanji: "ge", weight: 1 }, // け + dakuten
  { hiragana: "ご", romanji: "go", weight: 1 }, // こ + dakuten
  
  { hiragana: "ざ", romanji: "za", weight: 1 }, // さ + dakuten
  { hiragana: "じ", romanji: "ji", weight: 1 }, // し + dakuten
  { hiragana: "ず", romanji: "zu", weight: 1 }, // す + dakuten
  { hiragana: "ぜ", romanji: "ze", weight: 1 }, // せ + dakuten
  { hiragana: "ぞ", romanji: "zo", weight: 1 }, // そ + dakuten
  
  { hiragana: "だ", romanji: "da", weight: 1 }, // た + dakuten
  { hiragana: "ぢ", romanji: "ji (di)", weight: 1 }, // ち + dakuten
  { hiragana: "づ", romanji: "zu (du)", weight: 1 }, // つ + dakuten
  { hiragana: "で", romanji: "de", weight: 1 }, // て + dakuten
  { hiragana: "ど", romanji: "do", weight: 1 }, // と + dakuten
  
  { hiragana: "ば", romanji: "ba", weight: 1 }, // は + dakuten
  { hiragana: "び", romanji: "bi", weight: 1 }, // ひ + dakuten
  { hiragana: "ぶ", romanji: "bu", weight: 1 }, // ふ + dakuten
  { hiragana: "べ", romanji: "be", weight: 1 }, // へ + dakuten
  { hiragana: "ぼ", romanji: "bo", weight: 1 }, // ほ + dakuten
  
  // Handakuten (semi-voiced) variants
  { hiragana: "ぱ", romanji: "pa", weight: 1 }, // は + handakuten
  { hiragana: "ぴ", romanji: "pi", weight: 1 }, // ひ + handakuten
  { hiragana: "ぷ", romanji: "pu", weight: 1 }, // ふ + handakuten
  { hiragana: "ぺ", romanji: "pe", weight: 1 }, // へ + handakuten
  { hiragana: "ぽ", romanji: "po", weight: 1 }, // ほ + handakuten
  
  // Small kana used in combinations
  { hiragana: "ぁ", romanji: "a (small)", weight: 1 }, // Small あ
  { hiragana: "ぃ", romanji: "i (small)", weight: 1 }, // Small い
  { hiragana: "ぅ", romanji: "u (small)", weight: 1 }, // Small う
  { hiragana: "ぇ", romanji: "e (small)", weight: 1 }, // Small え
  { hiragana: "ぉ", romanji: "o (small)", weight: 1 }, // Small お
  { hiragana: "ゃ", romanji: "ya (small)", weight: 1 }, // Small や
  { hiragana: "ゅ", romanji: "yu (small)", weight: 1 }, // Small ゆ
  { hiragana: "ょ", romanji: "yo (small)", weight: 1 }, // Small よ
  { hiragana: "ゎ", romanji: "wa (small)", weight: 1 }, // Small わ
  
  // Common compound hiragana characters
  { hiragana: "きゃ", romanji: "kya", weight: 1 },
  { hiragana: "きゅ", romanji: "kyu", weight: 1 },
  { hiragana: "きょ", romanji: "kyo", weight: 1 },
  { hiragana: "しゃ", romanji: "sha", weight: 1 },
  { hiragana: "しゅ", romanji: "shu", weight: 1 },
  { hiragana: "しょ", romanji: "sho", weight: 1 },
  { hiragana: "ちゃ", romanji: "cha", weight: 1 },
  { hiragana: "ちゅ", romanji: "chu", weight: 1 },
  { hiragana: "ちょ", romanji: "cho", weight: 1 },
  { hiragana: "にゃ", romanji: "nya", weight: 1 },
  { hiragana: "にゅ", romanji: "nyu", weight: 1 },
  { hiragana: "にょ", romanji: "nyo", weight: 1 },
  { hiragana: "ひゃ", romanji: "hya", weight: 1 },
  { hiragana: "ひゅ", romanji: "hyu", weight: 1 },
  { hiragana: "ひょ", romanji: "hyo", weight: 1 },
  { hiragana: "みゃ", romanji: "mya", weight: 1 },
  { hiragana: "みゅ", romanji: "myu", weight: 1 },
  { hiragana: "みょ", romanji: "myo", weight: 1 },
  { hiragana: "りゃ", romanji: "rya", weight: 1 },
  { hiragana: "りゅ", romanji: "ryu", weight: 1 },
  { hiragana: "りょ", romanji: "ryo", weight: 1 },
  { hiragana: "ぎゃ", romanji: "gya", weight: 1 },
  { hiragana: "ぎゅ", romanji: "gyu", weight: 1 },
  { hiragana: "ぎょ", romanji: "gyo", weight: 1 },
  { hiragana: "じゃ", romanji: "ja", weight: 1 },
  { hiragana: "じゅ", romanji: "ju", weight: 1 },
  { hiragana: "じょ", romanji: "jo", weight: 1 },
  { hiragana: "びゃ", romanji: "bya", weight: 1 },
  { hiragana: "びゅ", romanji: "byu", weight: 1 },
  { hiragana: "びょ", romanji: "byo", weight: 1 },
  { hiragana: "ぴゃ", romanji: "pya", weight: 1 },
  { hiragana: "ぴゅ", romanji: "pyu", weight: 1 },
  { hiragana: "ぴょ", romanji: "pyo", weight: 1 },
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
  
  // Additional katakana characters
  { katakana: "ガ", romanji: "ga", weight: 1 },
  { katakana: "ギ", romanji: "gi", weight: 1 },
  { katakana: "グ", romanji: "gu", weight: 1 },
  { katakana: "ゲ", romanji: "ge", weight: 1 },
  { katakana: "ゴ", romanji: "go", weight: 1 },
  
  { katakana: "ザ", romanji: "za", weight: 1 },
  { katakana: "ジ", romanji: "ji", weight: 1 },
  { katakana: "ズ", romanji: "zu", weight: 1 },
  { katakana: "ゼ", romanji: "ze", weight: 1 },
  { katakana: "ゾ", romanji: "zo", weight: 1 },
  
  { katakana: "ダ", romanji: "da", weight: 1 },
  { katakana: "ヂ", romanji: "ji (di)", weight: 1 },
  { katakana: "ヅ", romanji: "zu (du)", weight: 1 },
  { katakana: "デ", romanji: "de", weight: 1 },
  { katakana: "ド", romanji: "do", weight: 1 },
  
  { katakana: "バ", romanji: "ba", weight: 1 },
  { katakana: "ビ", romanji: "bi", weight: 1 },
  { katakana: "ブ", romanji: "bu", weight: 1 },
  { katakana: "ベ", romanji: "be", weight: 1 },
  { katakana: "ボ", romanji: "bo", weight: 1 },
  
  { katakana: "パ", romanji: "pa", weight: 1 },
  { katakana: "ピ", romanji: "pi", weight: 1 },
  { katakana: "プ", romanji: "pu", weight: 1 },
  { katakana: "ペ", romanji: "pe", weight: 1 },
  { katakana: "ポ", romanji: "po", weight: 1 },
  
  { katakana: "ッ", romanji: "tsu (small)", weight: 1 }, // Small tsu
  { katakana: "ァ", romanji: "a (small)", weight: 1 }, // Small ア
  { katakana: "ィ", romanji: "i (small)", weight: 1 }, // Small イ
  { katakana: "ゥ", romanji: "u (small)", weight: 1 }, // Small ウ
  { katakana: "ェ", romanji: "e (small)", weight: 1 }, // Small エ
  { katakana: "ォ", romanji: "o (small)", weight: 1 }, // Small オ
  { katakana: "ャ", romanji: "ya (small)", weight: 1 }, // Small ヤ
  { katakana: "ュ", romanji: "yu (small)", weight: 1 }, // Small ユ
  { katakana: "ョ", romanji: "yo (small)", weight: 1 }, // Small ヨ
  { katakana: "ヮ", romanji: "wa (small)", weight: 1 }, // Small ワ
  
  // Extended katakana for foreign words
  { katakana: "ヴ", romanji: "vu", weight: 1 }, // V sound
  { katakana: "ファ", romanji: "fa", weight: 1 },
  { katakana: "フィ", romanji: "fi", weight: 1 },
  { katakana: "フェ", romanji: "fe", weight: 1 },
  { katakana: "フォ", romanji: "fo", weight: 1 },
  { katakana: "ウィ", romanji: "wi", weight: 1 },
  { katakana: "ウェ", romanji: "we", weight: 1 },
  { katakana: "ティ", romanji: "ti", weight: 1 },
  { katakana: "トゥ", romanji: "tu", weight: 1 },
  { katakana: "ディ", romanji: "di", weight: 1 },
  { katakana: "ドゥ", romanji: "du", weight: 1 },
  { katakana: "シェ", romanji: "she", weight: 1 },
  { katakana: "ジェ", romanji: "je", weight: 1 },
  
  // Common compound katakana characters
  { katakana: "キャ", romanji: "kya", weight: 1 },
  { katakana: "キュ", romanji: "kyu", weight: 1 },
  { katakana: "キョ", romanji: "kyo", weight: 1 },
  { katakana: "シャ", romanji: "sha", weight: 1 },
  { katakana: "シュ", romanji: "shu", weight: 1 },
  { katakana: "ショ", romanji: "sho", weight: 1 },
  { katakana: "チャ", romanji: "cha", weight: 1 },
  { katakana: "チュ", romanji: "chu", weight: 1 },
  { katakana: "チョ", romanji: "cho", weight: 1 },
  { katakana: "ニャ", romanji: "nya", weight: 1 },
  { katakana: "ニュ", romanji: "nyu", weight: 1 },
  { katakana: "ニョ", romanji: "nyo", weight: 1 },
  { katakana: "ヒャ", romanji: "hya", weight: 1 },
  { katakana: "ヒュ", romanji: "hyu", weight: 1 },
  { katakana: "ヒョ", romanji: "hyo", weight: 1 },
  { katakana: "ミャ", romanji: "mya", weight: 1 },
  { katakana: "ミュ", romanji: "myu", weight: 1 },
  { katakana: "ミョ", romanji: "myo", weight: 1 },
  { katakana: "リャ", romanji: "rya", weight: 1 },
  { katakana: "リュ", romanji: "ryu", weight: 1 },
  { katakana: "リョ", romanji: "ryo", weight: 1 },
  { katakana: "ギャ", romanji: "gya", weight: 1 },
  { katakana: "ギュ", romanji: "gyu", weight: 1 },
  { katakana: "ギョ", romanji: "gyo", weight: 1 },
  { katakana: "ジャ", romanji: "ja", weight: 1 },
  { katakana: "ジュ", romanji: "ju", weight: 1 },
  { katakana: "ジョ", romanji: "jo", weight: 1 },
  { katakana: "ビャ", romanji: "bya", weight: 1 },
  { katakana: "ビュ", romanji: "byu", weight: 1 },
  { katakana: "ビョ", romanji: "byo", weight: 1 },
  { katakana: "ピャ", romanji: "pya", weight: 1 },
  { katakana: "ピュ", romanji: "pyu", weight: 1 },
  { katakana: "ピョ", romanji: "pyo", weight: 1 },
];

/**
 * Ensures all kana characters are in the database
 * This should be called during app initialization
 * Now uses the API route instead of direct Prisma access
 */
export const ensureKanaCharactersInDatabase = async (): Promise<void> => {
  try {
    const response = await fetch('/api/init-database');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to initialize database');
    }
    
    console.log('Kana characters added to database successfully');
  } catch (error) {
    console.error('Error ensuring kana characters in database:', error);
    throw error;
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
  // If no characters are provided, return an empty character
  if (!characterData.length) {
    return { romanji: "", weight: 1 };
  }
  
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
 * Retrieves hiragana characters with weights from API for a user.
 * If userId is not provided, returns default weights.
 *
 * @param {string} [userId] - Optional user ID to fetch personalized weights
 * @returns {Promise<Character[]>} - A list of hiragana characters with weights
 */
export const getHiraganaList = async (userId?: string): Promise<Character[]> => {
  try {
    const url = userId ? 
      `/api/kana/hiragana?userId=${encodeURIComponent(userId)}` : 
      '/api/kana/hiragana';
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    
    return hiraganaList;
  } catch (error) {
    console.error('Error fetching hiragana list:', error);
    return hiraganaList;
  }
};

/**
 * Retrieves katakana characters with weights from API for a user.
 * If userId is not provided, returns default weights.
 *
 * @param {string} [userId] - Optional user ID to fetch personalized weights
 * @returns {Promise<Character[]>} - A list of katakana characters with weights
 */
export const getKatakanaList = async (userId?: string): Promise<Character[]> => {
  try {
    const url = userId ? 
      `/api/kana/katakana?userId=${encodeURIComponent(userId)}` : 
      '/api/kana/katakana';
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    
    return katakanaList;
  } catch (error) {
    console.error('Error fetching katakana list:', error);
    return katakanaList;
  }
};

