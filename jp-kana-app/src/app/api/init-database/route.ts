import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { KanaType } from '@prisma/client';

// Define interfaces for character data
interface Character {
  hiragana?: string;
  katakana?: string;
  romanji: string;
  weight: number;
}

// Complete hiragana character list
const hiraganaList: Character[] = [
  // Basic vowels
  { hiragana: "あ", romanji: "a", weight: 1 },
  { hiragana: "い", romanji: "i", weight: 1 },
  { hiragana: "う", romanji: "u", weight: 1 },
  { hiragana: "え", romanji: "e", weight: 1 },
  { hiragana: "お", romanji: "o", weight: 1 },
  
  // K-row
  { hiragana: "か", romanji: "ka", weight: 1 },
  { hiragana: "き", romanji: "ki", weight: 1 },
  { hiragana: "く", romanji: "ku", weight: 1 },
  { hiragana: "け", romanji: "ke", weight: 1 },
  { hiragana: "こ", romanji: "ko", weight: 1 },
  
  // S-row
  { hiragana: "さ", romanji: "sa", weight: 1 },
  { hiragana: "し", romanji: "shi", weight: 1 },
  { hiragana: "す", romanji: "su", weight: 1 },
  { hiragana: "せ", romanji: "se", weight: 1 },
  { hiragana: "そ", romanji: "so", weight: 1 },
  
  // T-row
  { hiragana: "た", romanji: "ta", weight: 1 },
  { hiragana: "ち", romanji: "chi", weight: 1 },
  { hiragana: "つ", romanji: "tsu", weight: 1 },
  { hiragana: "て", romanji: "te", weight: 1 },
  { hiragana: "と", romanji: "to", weight: 1 },
  
  // N-row
  { hiragana: "な", romanji: "na", weight: 1 },
  { hiragana: "に", romanji: "ni", weight: 1 },
  { hiragana: "ぬ", romanji: "nu", weight: 1 },
  { hiragana: "ね", romanji: "ne", weight: 1 },
  { hiragana: "の", romanji: "no", weight: 1 },
  
  // H-row
  { hiragana: "は", romanji: "ha", weight: 1 },
  { hiragana: "ひ", romanji: "hi", weight: 1 },
  { hiragana: "ふ", romanji: "fu", weight: 1 },
  { hiragana: "へ", romanji: "he", weight: 1 },
  { hiragana: "ほ", romanji: "ho", weight: 1 },
  
  // M-row
  { hiragana: "ま", romanji: "ma", weight: 1 },
  { hiragana: "み", romanji: "mi", weight: 1 },
  { hiragana: "む", romanji: "mu", weight: 1 },
  { hiragana: "め", romanji: "me", weight: 1 },
  { hiragana: "も", romanji: "mo", weight: 1 },
  
  // Y-row
  { hiragana: "や", romanji: "ya", weight: 1 },
  { hiragana: "ゆ", romanji: "yu", weight: 1 },
  { hiragana: "よ", romanji: "yo", weight: 1 },
  
  // R-row
  { hiragana: "ら", romanji: "ra", weight: 1 },
  { hiragana: "り", romanji: "ri", weight: 1 },
  { hiragana: "る", romanji: "ru", weight: 1 },
  { hiragana: "れ", romanji: "re", weight: 1 },
  { hiragana: "ろ", romanji: "ro", weight: 1 },
  
  // W-row
  { hiragana: "わ", romanji: "wa", weight: 1 },
  { hiragana: "を", romanji: "wo", weight: 1 },
  
  // N
  { hiragana: "ん", romanji: "n", weight: 1 },
  
  // Dakuten variations
  { hiragana: "が", romanji: "ga", weight: 1 },
  { hiragana: "ぎ", romanji: "gi", weight: 1 },
  { hiragana: "ぐ", romanji: "gu", weight: 1 },
  { hiragana: "げ", romanji: "ge", weight: 1 },
  { hiragana: "ご", romanji: "go", weight: 1 },
  
  { hiragana: "ざ", romanji: "za", weight: 1 },
  { hiragana: "じ", romanji: "ji", weight: 1 },
  { hiragana: "ず", romanji: "zu", weight: 1 },
  { hiragana: "ぜ", romanji: "ze", weight: 1 },
  { hiragana: "ぞ", romanji: "zo", weight: 1 },
  
  { hiragana: "だ", romanji: "da", weight: 1 },
  { hiragana: "ぢ", romanji: "ji", weight: 1 },
  { hiragana: "づ", romanji: "zu", weight: 1 },
  { hiragana: "で", romanji: "de", weight: 1 },
  { hiragana: "ど", romanji: "do", weight: 1 },
  
  { hiragana: "ば", romanji: "ba", weight: 1 },
  { hiragana: "び", romanji: "bi", weight: 1 },
  { hiragana: "ぶ", romanji: "bu", weight: 1 },
  { hiragana: "べ", romanji: "be", weight: 1 },
  { hiragana: "ぼ", romanji: "bo", weight: 1 },
  
  // Handakuten variations
  { hiragana: "ぱ", romanji: "pa", weight: 1 },
  { hiragana: "ぴ", romanji: "pi", weight: 1 },
  { hiragana: "ぷ", romanji: "pu", weight: 1 },
  { hiragana: "ぺ", romanji: "pe", weight: 1 },
  { hiragana: "ぽ", romanji: "po", weight: 1 },
];

// Complete katakana character list
const katakanaList: Character[] = [
  // Basic vowels
  { katakana: "ア", romanji: "a", weight: 1 },
  { katakana: "イ", romanji: "i", weight: 1 },
  { katakana: "ウ", romanji: "u", weight: 1 },
  { katakana: "エ", romanji: "e", weight: 1 },
  { katakana: "オ", romanji: "o", weight: 1 },
  
  // K-row
  { katakana: "カ", romanji: "ka", weight: 1 },
  { katakana: "キ", romanji: "ki", weight: 1 },
  { katakana: "ク", romanji: "ku", weight: 1 },
  { katakana: "ケ", romanji: "ke", weight: 1 },
  { katakana: "コ", romanji: "ko", weight: 1 },
  
  // S-row
  { katakana: "サ", romanji: "sa", weight: 1 },
  { katakana: "シ", romanji: "shi", weight: 1 },
  { katakana: "ス", romanji: "su", weight: 1 },
  { katakana: "セ", romanji: "se", weight: 1 },
  { katakana: "ソ", romanji: "so", weight: 1 },
  
  // T-row
  { katakana: "タ", romanji: "ta", weight: 1 },
  { katakana: "チ", romanji: "chi", weight: 1 },
  { katakana: "ツ", romanji: "tsu", weight: 1 },
  { katakana: "テ", romanji: "te", weight: 1 },
  { katakana: "ト", romanji: "to", weight: 1 },
  
  // N-row
  { katakana: "ナ", romanji: "na", weight: 1 },
  { katakana: "ニ", romanji: "ni", weight: 1 },
  { katakana: "ヌ", romanji: "nu", weight: 1 },
  { katakana: "ネ", romanji: "ne", weight: 1 },
  { katakana: "ノ", romanji: "no", weight: 1 },
  
  // H-row
  { katakana: "ハ", romanji: "ha", weight: 1 },
  { katakana: "ヒ", romanji: "hi", weight: 1 },
  { katakana: "フ", romanji: "fu", weight: 1 },
  { katakana: "ヘ", romanji: "he", weight: 1 },
  { katakana: "ホ", romanji: "ho", weight: 1 },
  
  // M-row
  { katakana: "マ", romanji: "ma", weight: 1 },
  { katakana: "ミ", romanji: "mi", weight: 1 },
  { katakana: "ム", romanji: "mu", weight: 1 },
  { katakana: "メ", romanji: "me", weight: 1 },
  { katakana: "モ", romanji: "mo", weight: 1 },
  
  // Y-row
  { katakana: "ヤ", romanji: "ya", weight: 1 },
  { katakana: "ユ", romanji: "yu", weight: 1 },
  { katakana: "ヨ", romanji: "yo", weight: 1 },
  
  // R-row
  { katakana: "ラ", romanji: "ra", weight: 1 },
  { katakana: "リ", romanji: "ri", weight: 1 },
  { katakana: "ル", romanji: "ru", weight: 1 },
  { katakana: "レ", romanji: "re", weight: 1 },
  { katakana: "ロ", romanji: "ro", weight: 1 },
  
  // W-row
  { katakana: "ワ", romanji: "wa", weight: 1 },
  { katakana: "ヲ", romanji: "wo", weight: 1 },
  
  // N
  { katakana: "ン", romanji: "n", weight: 1 },
  
  // Dakuten variations
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
  { katakana: "ヂ", romanji: "ji", weight: 1 },
  { katakana: "ヅ", romanji: "zu", weight: 1 },
  { katakana: "デ", romanji: "de", weight: 1 },
  { katakana: "ド", romanji: "do", weight: 1 },
  
  { katakana: "バ", romanji: "ba", weight: 1 },
  { katakana: "ビ", romanji: "bi", weight: 1 },
  { katakana: "ブ", romanji: "bu", weight: 1 },
  { katakana: "ベ", romanji: "be", weight: 1 },
  { katakana: "ボ", romanji: "bo", weight: 1 },
  
  // Handakuten variations
  { katakana: "パ", romanji: "pa", weight: 1 },
  { katakana: "ピ", romanji: "pi", weight: 1 },
  { katakana: "プ", romanji: "pu", weight: 1 },
  { katakana: "ペ", romanji: "pe", weight: 1 },
  { katakana: "ポ", romanji: "po", weight: 1 },
];

export async function GET() {
  try {
    // Use transaction for better performance and atomicity
    await prisma.$transaction(async (tx) => {
      // Process hiragana
      for (const char of hiraganaList) {
        if (!char.hiragana) continue;
        
        await tx.flashcard.upsert({
          where: {
            kana_type: {
              kana: char.hiragana,
              type: KanaType.hiragana
            }
          },
          update: { romaji: char.romanji },
          create: {
            kana: char.hiragana,
            type: KanaType.hiragana,
            romaji: char.romanji
          }
        });
      }
      
      // Process katakana
      for (const char of katakanaList) {
        if (!char.katakana) continue;
        
        await tx.flashcard.upsert({
          where: {
            kana_type: {
              kana: char.katakana,
              type: KanaType.katakana
            }
          },
          update: { romaji: char.romanji },
          create: {
            kana: char.katakana,
            type: KanaType.katakana,
            romaji: char.romanji
          }
        });
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Kana characters added to database successfully' 
    });
  } catch (error) {
    console.error('Error ensuring kana characters in database:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error initializing database', 
      error: String(error) 
    }, { status: 500 });
  }
} 