import { NextRequest, NextResponse } from 'next/server';

const hiragana = [
  { character: 'あ', romaji: 'a' },
  { character: 'い', romaji: 'i' },
  { character: 'う', romaji: 'u' },
  { character: 'え', romaji: 'e' },
  { character: 'お', romaji: 'o' },
];

const katakana = [
  { character: 'ア', romaji: 'a' },
  { character: 'イ', romaji: 'i' },
  { character: 'ウ', romaji: 'u' },
  { character: 'エ', romaji: 'e' },
  { character: 'オ', romaji: 'o' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  
  let data;
  
  switch (type) {
    case 'hiragana':
      data = hiragana;
      break;
    case 'katakana':
      data = katakana;
      break;
    default:
      data = { hiragana, katakana };
  }
  
  return NextResponse.json(data);
} 