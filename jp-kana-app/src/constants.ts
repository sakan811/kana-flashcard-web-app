/**
 * Application-wide constants
 */

import { Character, KanaType } from "./types/kana";

// Default user ID for when authentication is not implemented
export const DEFAULT_USER_ID = "default-user";

// Cache duration in milliseconds for API responses
export const CACHE_DURATION = 5000; // 5 seconds

export const INITIAL_WEIGHT = 1;

export const INITIAL_KANA_STATE = {
  kana: "",
  romaji: "",
  type: KanaType.hiragana,
  weight: INITIAL_WEIGHT,
};

// Complete hiragana character set with romaji
export const HIRAGANA_CHARACTERS: Character[] = [
  { kana: "あ", romaji: "a", type: KanaType.hiragana, weight: 1 },
  { kana: "い", romaji: "i", type: KanaType.hiragana, weight: 1 },
  { kana: "う", romaji: "u", type: KanaType.hiragana, weight: 1 },
  { kana: "え", romaji: "e", type: KanaType.hiragana, weight: 1 },
  { kana: "お", romaji: "o", type: KanaType.hiragana, weight: 1 },
  // K-row
  { kana: "か", romaji: "ka", type: KanaType.hiragana, weight: 1 },
  { kana: "き", romaji: "ki", type: KanaType.hiragana, weight: 1 },
  { kana: "く", romaji: "ku", type: KanaType.hiragana, weight: 1 },
  { kana: "け", romaji: "ke", type: KanaType.hiragana, weight: 1 },
  { kana: "こ", romaji: "ko", type: KanaType.hiragana, weight: 1 },
  // G-row
  { kana: "が", romaji: "ga", type: KanaType.hiragana, weight: 1 },
  { kana: "ぎ", romaji: "gi", type: KanaType.hiragana, weight: 1 },
  { kana: "ぐ", romaji: "gu", type: KanaType.hiragana, weight: 1 },
  { kana: "げ", romaji: "ge", type: KanaType.hiragana, weight: 1 },
  { kana: "ご", romaji: "go", type: KanaType.hiragana, weight: 1 },
  // S-row
  { kana: "さ", romaji: "sa", type: KanaType.hiragana, weight: 1 },
  { kana: "し", romaji: "shi", type: KanaType.hiragana, weight: 1 },
  { kana: "す", romaji: "su", type: KanaType.hiragana, weight: 1 },
  { kana: "せ", romaji: "se", type: KanaType.hiragana, weight: 1 },
  { kana: "そ", romaji: "so", type: KanaType.hiragana, weight: 1 },
  // Z-row
  { kana: "ざ", romaji: "za", type: KanaType.hiragana, weight: 1 },
  { kana: "じ", romaji: "ji", type: KanaType.hiragana, weight: 1 },
  { kana: "ず", romaji: "zu", type: KanaType.hiragana, weight: 1 },
  { kana: "ぜ", romaji: "ze", type: KanaType.hiragana, weight: 1 },
  { kana: "ぞ", romaji: "zo", type: KanaType.hiragana, weight: 1 },
  // T-row
  { kana: "た", romaji: "ta", type: KanaType.hiragana, weight: 1 },
  { kana: "ち", romaji: "chi", type: KanaType.hiragana, weight: 1 },
  { kana: "つ", romaji: "tsu", type: KanaType.hiragana, weight: 1 },
  { kana: "て", romaji: "te", type: KanaType.hiragana, weight: 1 },
  { kana: "と", romaji: "to", type: KanaType.hiragana, weight: 1 },
  // D-row
  { kana: "だ", romaji: "da", type: KanaType.hiragana, weight: 1 },
  { kana: "ぢ", romaji: "ji", type: KanaType.hiragana, weight: 1 }, // Alternative: "di"
  { kana: "づ", romaji: "zu", type: KanaType.hiragana, weight: 1 }, // Alternative: "du"
  { kana: "で", romaji: "de", type: KanaType.hiragana, weight: 1 },
  { kana: "ど", romaji: "do", type: KanaType.hiragana, weight: 1 },
  // N-row
  { kana: "な", romaji: "na", type: KanaType.hiragana, weight: 1 },
  { kana: "に", romaji: "ni", type: KanaType.hiragana, weight: 1 },
  { kana: "ぬ", romaji: "nu", type: KanaType.hiragana, weight: 1 },
  { kana: "ね", romaji: "ne", type: KanaType.hiragana, weight: 1 },
  { kana: "の", romaji: "no", type: KanaType.hiragana, weight: 1 },
  // H-row
  { kana: "は", romaji: "ha", type: KanaType.hiragana, weight: 1 },
  { kana: "ひ", romaji: "hi", type: KanaType.hiragana, weight: 1 },
  { kana: "ふ", romaji: "fu", type: KanaType.hiragana, weight: 1 },
  { kana: "へ", romaji: "he", type: KanaType.hiragana, weight: 1 },
  { kana: "ほ", romaji: "ho", type: KanaType.hiragana, weight: 1 },
  // B-row
  { kana: "ば", romaji: "ba", type: KanaType.hiragana, weight: 1 },
  { kana: "び", romaji: "bi", type: KanaType.hiragana, weight: 1 },
  { kana: "ぶ", romaji: "bu", type: KanaType.hiragana, weight: 1 },
  { kana: "べ", romaji: "be", type: KanaType.hiragana, weight: 1 },
  { kana: "ぼ", romaji: "bo", type: KanaType.hiragana, weight: 1 },
  // P-row
  { kana: "ぱ", romaji: "pa", type: KanaType.hiragana, weight: 1 },
  { kana: "ぴ", romaji: "pi", type: KanaType.hiragana, weight: 1 },
  { kana: "ぷ", romaji: "pu", type: KanaType.hiragana, weight: 1 },
  { kana: "ぺ", romaji: "pe", type: KanaType.hiragana, weight: 1 },
  { kana: "ぽ", romaji: "po", type: KanaType.hiragana, weight: 1 },
  // M-row
  { kana: "ま", romaji: "ma", type: KanaType.hiragana, weight: 1 },
  { kana: "み", romaji: "mi", type: KanaType.hiragana, weight: 1 },
  { kana: "む", romaji: "mu", type: KanaType.hiragana, weight: 1 },
  { kana: "め", romaji: "me", type: KanaType.hiragana, weight: 1 },
  { kana: "も", romaji: "mo", type: KanaType.hiragana, weight: 1 },
  // Y-row
  { kana: "や", romaji: "ya", type: KanaType.hiragana, weight: 1 },
  { kana: "ゆ", romaji: "yu", type: KanaType.hiragana, weight: 1 },
  { kana: "よ", romaji: "yo", type: KanaType.hiragana, weight: 1 },
  // R-row
  { kana: "ら", romaji: "ra", type: KanaType.hiragana, weight: 1 },
  { kana: "り", romaji: "ri", type: KanaType.hiragana, weight: 1 },
  { kana: "る", romaji: "ru", type: KanaType.hiragana, weight: 1 },
  { kana: "れ", romaji: "re", type: KanaType.hiragana, weight: 1 },
  { kana: "ろ", romaji: "ro", type: KanaType.hiragana, weight: 1 },
  // W-row
  { kana: "わ", romaji: "wa", type: KanaType.hiragana, weight: 1 },
  { kana: "を", romaji: "wo", type: KanaType.hiragana, weight: 1 },
  // N
  { kana: "ん", romaji: "n", type: KanaType.hiragana, weight: 1 },
];

// Complete katakana character set with romaji
export const KATAKANA_CHARACTERS: Character[] = [
  { kana: "ア", romaji: "a", type: KanaType.katakana, weight: 1 },
  { kana: "イ", romaji: "i", type: KanaType.katakana, weight: 1 },
  { kana: "ウ", romaji: "u", type: KanaType.katakana, weight: 1 },
  { kana: "エ", romaji: "e", type: KanaType.katakana, weight: 1 },
  { kana: "オ", romaji: "o", type: KanaType.katakana, weight: 1 },
  // K-row
  { kana: "カ", romaji: "ka", type: KanaType.katakana, weight: 1 },
  { kana: "キ", romaji: "ki", type: KanaType.katakana, weight: 1 },
  { kana: "ク", romaji: "ku", type: KanaType.katakana, weight: 1 },
  { kana: "ケ", romaji: "ke", type: KanaType.katakana, weight: 1 },
  { kana: "コ", romaji: "ko", type: KanaType.katakana, weight: 1 },
  // G-row (dakuten K-row)
  { kana: "ガ", romaji: "ga", type: KanaType.katakana, weight: 1 },
  { kana: "ギ", romaji: "gi", type: KanaType.katakana, weight: 1 },
  { kana: "グ", romaji: "gu", type: KanaType.katakana, weight: 1 },
  { kana: "ゲ", romaji: "ge", type: KanaType.katakana, weight: 1 },
  { kana: "ゴ", romaji: "go", type: KanaType.katakana, weight: 1 },
  // S-row
  { kana: "サ", romaji: "sa", type: KanaType.katakana, weight: 1 },
  { kana: "シ", romaji: "shi", type: KanaType.katakana, weight: 1 },
  { kana: "ス", romaji: "su", type: KanaType.katakana, weight: 1 },
  { kana: "セ", romaji: "se", type: KanaType.katakana, weight: 1 },
  { kana: "ソ", romaji: "so", type: KanaType.katakana, weight: 1 },
  // Z-row (dakuten S-row)
  { kana: "ザ", romaji: "za", type: KanaType.katakana, weight: 1 },
  { kana: "ジ", romaji: "ji", type: KanaType.katakana, weight: 1 },
  { kana: "ズ", romaji: "zu", type: KanaType.katakana, weight: 1 },
  { kana: "ゼ", romaji: "ze", type: KanaType.katakana, weight: 1 },
  { kana: "ゾ", romaji: "zo", type: KanaType.katakana, weight: 1 },
  // T-row
  { kana: "タ", romaji: "ta", type: KanaType.katakana, weight: 1 },
  { kana: "チ", romaji: "chi", type: KanaType.katakana, weight: 1 },
  { kana: "ツ", romaji: "tsu", type: KanaType.katakana, weight: 1 },
  { kana: "テ", romaji: "te", type: KanaType.katakana, weight: 1 },
  { kana: "ト", romaji: "to", type: KanaType.katakana, weight: 1 },
  // D-row (dakuten T-row)
  { kana: "ダ", romaji: "da", type: KanaType.katakana, weight: 1 },
  { kana: "ヂ", romaji: "ji", type: KanaType.katakana, weight: 1 },
  { kana: "ヅ", romaji: "zu", type: KanaType.katakana, weight: 1 },
  { kana: "デ", romaji: "de", type: KanaType.katakana, weight: 1 },
  { kana: "ド", romaji: "do", type: KanaType.katakana, weight: 1 },
  // N-row
  { kana: "ナ", romaji: "na", type: KanaType.katakana, weight: 1 },
  { kana: "ニ", romaji: "ni", type: KanaType.katakana, weight: 1 },
  { kana: "ヌ", romaji: "nu", type: KanaType.katakana, weight: 1 },
  { kana: "ネ", romaji: "ne", type: KanaType.katakana, weight: 1 },
  { kana: "ノ", romaji: "no", type: KanaType.katakana, weight: 1 },
  // H-row
  { kana: "ハ", romaji: "ha", type: KanaType.katakana, weight: 1 },
  { kana: "ヒ", romaji: "hi", type: KanaType.katakana, weight: 1 },
  { kana: "フ", romaji: "fu", type: KanaType.katakana, weight: 1 },
  { kana: "ヘ", romaji: "he", type: KanaType.katakana, weight: 1 },
  { kana: "ホ", romaji: "ho", type: KanaType.katakana, weight: 1 },
  // B-row (dakuten H-row)
  { kana: "バ", romaji: "ba", type: KanaType.katakana, weight: 1 },
  { kana: "ビ", romaji: "bi", type: KanaType.katakana, weight: 1 },
  { kana: "ブ", romaji: "bu", type: KanaType.katakana, weight: 1 },
  { kana: "ベ", romaji: "be", type: KanaType.katakana, weight: 1 },
  { kana: "ボ", romaji: "bo", type: KanaType.katakana, weight: 1 },
  // P-row (handakuten H-row)
  { kana: "パ", romaji: "pa", type: KanaType.katakana, weight: 1 },
  { kana: "ピ", romaji: "pi", type: KanaType.katakana, weight: 1 },
  { kana: "プ", romaji: "pu", type: KanaType.katakana, weight: 1 },
  { kana: "ペ", romaji: "pe", type: KanaType.katakana, weight: 1 },
  { kana: "ポ", romaji: "po", type: KanaType.katakana, weight: 1 },
  // M-row
  { kana: "マ", romaji: "ma", type: KanaType.katakana, weight: 1 },
  { kana: "ミ", romaji: "mi", type: KanaType.katakana, weight: 1 },
  { kana: "ム", romaji: "mu", type: KanaType.katakana, weight: 1 },
  { kana: "メ", romaji: "me", type: KanaType.katakana, weight: 1 },
  { kana: "モ", romaji: "mo", type: KanaType.katakana, weight: 1 },
  // Y-row
  { kana: "ヤ", romaji: "ya", type: KanaType.katakana, weight: 1 },
  { kana: "ユ", romaji: "yu", type: KanaType.katakana, weight: 1 },
  { kana: "ヨ", romaji: "yo", type: KanaType.katakana, weight: 1 },
  // R-row
  { kana: "ラ", romaji: "ra", type: KanaType.katakana, weight: 1 },
  { kana: "リ", romaji: "ri", type: KanaType.katakana, weight: 1 },
  { kana: "ル", romaji: "ru", type: KanaType.katakana, weight: 1 },
  { kana: "レ", romaji: "re", type: KanaType.katakana, weight: 1 },
  { kana: "ロ", romaji: "ro", type: KanaType.katakana, weight: 1 },
  // W-row
  { kana: "ワ", romaji: "wa", type: KanaType.katakana, weight: 1 },
  { kana: "ヲ", romaji: "wo", type: KanaType.katakana, weight: 1 },
  // N (special)
  { kana: "ン", romaji: "n", type: KanaType.katakana, weight: 1 },
];
