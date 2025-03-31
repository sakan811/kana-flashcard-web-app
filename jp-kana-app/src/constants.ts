/**
 * Application-wide constants
 */

import { Character } from "@/types";

// Default user ID for when authentication is not implemented
export const DEFAULT_USER_ID = "default-user";

// Cache duration in milliseconds for API responses
export const CACHE_DURATION = 5000; // 5 seconds

// Complete hiragana character set with romanji
export const HIRAGANA_DATA: Character[] = [
  { kana: "あ", romanji: "a", type: "hiragana", weight: 1 },
  { kana: "い", romanji: "i", type: "hiragana", weight: 1 },
  { kana: "う", romanji: "u", type: "hiragana", weight: 1 },
  { kana: "え", romanji: "e", type: "hiragana", weight: 1 },
  { kana: "お", romanji: "o", type: "hiragana", weight: 1 },
  // K-row
  { kana: "か", romanji: "ka", type: "hiragana", weight: 1 },
  { kana: "き", romanji: "ki", type: "hiragana", weight: 1 },
  { kana: "く", romanji: "ku", type: "hiragana", weight: 1 },
  { kana: "け", romanji: "ke", type: "hiragana", weight: 1 },
  { kana: "こ", romanji: "ko", type: "hiragana", weight: 1 },
  // G-row (dakuten K-row)
  { kana: "が", romanji: "ga", type: "hiragana", weight: 1 },
  { kana: "ぎ", romanji: "gi", type: "hiragana", weight: 1 },
  { kana: "ぐ", romanji: "gu", type: "hiragana", weight: 1 },
  { kana: "げ", romanji: "ge", type: "hiragana", weight: 1 },
  { kana: "ご", romanji: "go", type: "hiragana", weight: 1 },
  // S-row
  { kana: "さ", romanji: "sa", type: "hiragana", weight: 1 },
  { kana: "し", romanji: "shi", type: "hiragana", weight: 1 },
  { kana: "す", romanji: "su", type: "hiragana", weight: 1 },
  { kana: "せ", romanji: "se", type: "hiragana", weight: 1 },
  { kana: "そ", romanji: "so", type: "hiragana", weight: 1 },
  // Z-row (dakuten S-row)
  { kana: "ざ", romanji: "za", type: "hiragana", weight: 1 },
  { kana: "じ", romanji: "ji", type: "hiragana", weight: 1 },
  { kana: "ず", romanji: "zu", type: "hiragana", weight: 1 },
  { kana: "ぜ", romanji: "ze", type: "hiragana", weight: 1 },
  { kana: "ぞ", romanji: "zo", type: "hiragana", weight: 1 },
  // T-row
  { kana: "た", romanji: "ta", type: "hiragana", weight: 1 },
  { kana: "ち", romanji: "chi", type: "hiragana", weight: 1 },
  { kana: "つ", romanji: "tsu", type: "hiragana", weight: 1 },
  { kana: "て", romanji: "te", type: "hiragana", weight: 1 },
  { kana: "と", romanji: "to", type: "hiragana", weight: 1 },
  // D-row (dakuten T-row)
  { kana: "だ", romanji: "da", type: "hiragana", weight: 1 },
  { kana: "ぢ", romanji: "ji", type: "hiragana", weight: 1 }, // Alternative: "di"
  { kana: "づ", romanji: "zu", type: "hiragana", weight: 1 }, // Alternative: "du"
  { kana: "で", romanji: "de", type: "hiragana", weight: 1 },
  { kana: "ど", romanji: "do", type: "hiragana", weight: 1 },
  // N-row
  { kana: "な", romanji: "na", type: "hiragana", weight: 1 },
  { kana: "に", romanji: "ni", type: "hiragana", weight: 1 },
  { kana: "ぬ", romanji: "nu", type: "hiragana", weight: 1 },
  { kana: "ね", romanji: "ne", type: "hiragana", weight: 1 },
  { kana: "の", romanji: "no", type: "hiragana", weight: 1 },
  // H-row
  { kana: "は", romanji: "ha", type: "hiragana", weight: 1 },
  { kana: "ひ", romanji: "hi", type: "hiragana", weight: 1 },
  { kana: "ふ", romanji: "fu", type: "hiragana", weight: 1 },
  { kana: "へ", romanji: "he", type: "hiragana", weight: 1 },
  { kana: "ほ", romanji: "ho", type: "hiragana", weight: 1 },
  // B-row (dakuten H-row)
  { kana: "ば", romanji: "ba", type: "hiragana", weight: 1 },
  { kana: "び", romanji: "bi", type: "hiragana", weight: 1 },
  { kana: "ぶ", romanji: "bu", type: "hiragana", weight: 1 },
  { kana: "べ", romanji: "be", type: "hiragana", weight: 1 },
  { kana: "ぼ", romanji: "bo", type: "hiragana", weight: 1 },
  // P-row (handakuten H-row)
  { kana: "ぱ", romanji: "pa", type: "hiragana", weight: 1 },
  { kana: "ぴ", romanji: "pi", type: "hiragana", weight: 1 },
  { kana: "ぷ", romanji: "pu", type: "hiragana", weight: 1 },
  { kana: "ぺ", romanji: "pe", type: "hiragana", weight: 1 },
  { kana: "ぽ", romanji: "po", type: "hiragana", weight: 1 },
  // M-row
  { kana: "ま", romanji: "ma", type: "hiragana", weight: 1 },
  { kana: "み", romanji: "mi", type: "hiragana", weight: 1 },
  { kana: "む", romanji: "mu", type: "hiragana", weight: 1 },
  { kana: "め", romanji: "me", type: "hiragana", weight: 1 },
  { kana: "も", romanji: "mo", type: "hiragana", weight: 1 },
  // Y-row
  { kana: "や", romanji: "ya", type: "hiragana", weight: 1 },
  { kana: "ゆ", romanji: "yu", type: "hiragana", weight: 1 },
  { kana: "よ", romanji: "yo", type: "hiragana", weight: 1 },
  // R-row
  { kana: "ら", romanji: "ra", type: "hiragana", weight: 1 },
  { kana: "り", romanji: "ri", type: "hiragana", weight: 1 },
  { kana: "る", romanji: "ru", type: "hiragana", weight: 1 },
  { kana: "れ", romanji: "re", type: "hiragana", weight: 1 },
  { kana: "ろ", romanji: "ro", type: "hiragana", weight: 1 },
  // W-row
  { kana: "わ", romanji: "wa", type: "hiragana", weight: 1 },
  { kana: "を", romanji: "wo", type: "hiragana", weight: 1 },
  // N (special)
  { kana: "ん", romanji: "n", type: "hiragana", weight: 1 },
];

// Complete katakana character set with romanji
export const KATAKANA_DATA: Character[] = [
  { kana: "ア", romanji: "a", type: "katakana", weight: 1 },
  { kana: "イ", romanji: "i", type: "katakana", weight: 1 },
  { kana: "ウ", romanji: "u", type: "katakana", weight: 1 },
  { kana: "エ", romanji: "e", type: "katakana", weight: 1 },
  { kana: "オ", romanji: "o", type: "katakana", weight: 1 },
  // K-row
  { kana: "カ", romanji: "ka", type: "katakana", weight: 1 },
  { kana: "キ", romanji: "ki", type: "katakana", weight: 1 },
  { kana: "ク", romanji: "ku", type: "katakana", weight: 1 },
  { kana: "ケ", romanji: "ke", type: "katakana", weight: 1 },
  { kana: "コ", romanji: "ko", type: "katakana", weight: 1 },
  // G-row (dakuten K-row)
  { kana: "ガ", romanji: "ga", type: "katakana", weight: 1 },
  { kana: "ギ", romanji: "gi", type: "katakana", weight: 1 },
  { kana: "グ", romanji: "gu", type: "katakana", weight: 1 },
  { kana: "ゲ", romanji: "ge", type: "katakana", weight: 1 },
  { kana: "ゴ", romanji: "go", type: "katakana", weight: 1 },
  // S-row
  { kana: "サ", romanji: "sa", type: "katakana", weight: 1 },
  { kana: "シ", romanji: "shi", type: "katakana", weight: 1 },
  { kana: "ス", romanji: "su", type: "katakana", weight: 1 },
  { kana: "セ", romanji: "se", type: "katakana", weight: 1 },
  { kana: "ソ", romanji: "so", type: "katakana", weight: 1 },
  // Z-row (dakuten S-row)
  { kana: "ザ", romanji: "za", type: "katakana", weight: 1 },
  { kana: "ジ", romanji: "ji", type: "katakana", weight: 1 },
  { kana: "ズ", romanji: "zu", type: "katakana", weight: 1 },
  { kana: "ゼ", romanji: "ze", type: "katakana", weight: 1 },
  { kana: "ゾ", romanji: "zo", type: "katakana", weight: 1 },
  // T-row
  { kana: "タ", romanji: "ta", type: "katakana", weight: 1 },
  { kana: "チ", romanji: "chi", type: "katakana", weight: 1 },
  { kana: "ツ", romanji: "tsu", type: "katakana", weight: 1 },
  { kana: "テ", romanji: "te", type: "katakana", weight: 1 },
  { kana: "ト", romanji: "to", type: "katakana", weight: 1 },
  // D-row (dakuten T-row)
  { kana: "ダ", romanji: "da", type: "katakana", weight: 1 },
  { kana: "ヂ", romanji: "ji", type: "katakana", weight: 1 },
  { kana: "ヅ", romanji: "zu", type: "katakana", weight: 1 },
  { kana: "デ", romanji: "de", type: "katakana", weight: 1 },
  { kana: "ド", romanji: "do", type: "katakana", weight: 1 },
  // N-row
  { kana: "ナ", romanji: "na", type: "katakana", weight: 1 },
  { kana: "ニ", romanji: "ni", type: "katakana", weight: 1 },
  { kana: "ヌ", romanji: "nu", type: "katakana", weight: 1 },
  { kana: "ネ", romanji: "ne", type: "katakana", weight: 1 },
  { kana: "ノ", romanji: "no", type: "katakana", weight: 1 },
  // H-row
  { kana: "ハ", romanji: "ha", type: "katakana", weight: 1 },
  { kana: "ヒ", romanji: "hi", type: "katakana", weight: 1 },
  { kana: "フ", romanji: "fu", type: "katakana", weight: 1 },
  { kana: "ヘ", romanji: "he", type: "katakana", weight: 1 },
  { kana: "ホ", romanji: "ho", type: "katakana", weight: 1 },
  // B-row (dakuten H-row)
  { kana: "バ", romanji: "ba", type: "katakana", weight: 1 },
  { kana: "ビ", romanji: "bi", type: "katakana", weight: 1 },
  { kana: "ブ", romanji: "bu", type: "katakana", weight: 1 },
  { kana: "ベ", romanji: "be", type: "katakana", weight: 1 },
  { kana: "ボ", romanji: "bo", type: "katakana", weight: 1 },
  // P-row (handakuten H-row)
  { kana: "パ", romanji: "pa", type: "katakana", weight: 1 },
  { kana: "ピ", romanji: "pi", type: "katakana", weight: 1 },
  { kana: "プ", romanji: "pu", type: "katakana", weight: 1 },
  { kana: "ペ", romanji: "pe", type: "katakana", weight: 1 },
  { kana: "ポ", romanji: "po", type: "katakana", weight: 1 },
  // M-row
  { kana: "マ", romanji: "ma", type: "katakana", weight: 1 },
  { kana: "ミ", romanji: "mi", type: "katakana", weight: 1 },
  { kana: "ム", romanji: "mu", type: "katakana", weight: 1 },
  { kana: "メ", romanji: "me", type: "katakana", weight: 1 },
  { kana: "モ", romanji: "mo", type: "katakana", weight: 1 },
  // Y-row
  { kana: "ヤ", romanji: "ya", type: "katakana", weight: 1 },
  { kana: "ユ", romanji: "yu", type: "katakana", weight: 1 },
  { kana: "ヨ", romanji: "yo", type: "katakana", weight: 1 },
  // R-row
  { kana: "ラ", romanji: "ra", type: "katakana", weight: 1 },
  { kana: "リ", romanji: "ri", type: "katakana", weight: 1 },
  { kana: "ル", romanji: "ru", type: "katakana", weight: 1 },
  { kana: "レ", romanji: "re", type: "katakana", weight: 1 },
  { kana: "ロ", romanji: "ro", type: "katakana", weight: 1 },
  // W-row
  { kana: "ワ", romanji: "wa", type: "katakana", weight: 1 },
  { kana: "ヲ", romanji: "wo", type: "katakana", weight: 1 },
  // N (special)
  { kana: "ン", romanji: "n", type: "katakana", weight: 1 },
];
