import { describe, it, expect } from 'vitest';
import {updateWeights} from "../../src/components/funcs/showKanaFunc";


interface KanaCharacter {
  katakana: string;
  romanji: string;
  weight: number;
}

interface ServerData {
  [key: string]: any;
  correct_percentage: number;
}

describe('updateWeights', () => {
  it('should update weights based on server data', () => {
    const initialKanaCharacters: KanaCharacter[] = [
      { katakana: 'ア', romanji: 'a', weight: 5 },
      { katakana: 'イ', romanji: 'i', weight: 5 },
    ];

    const serverData: ServerData[] = [
      { katakana: 'ア', correct_percentage: 80 },
      { katakana: 'イ', correct_percentage: 50 },
    ];

    const updatedKanaCharacters = updateWeights(initialKanaCharacters, serverData, 'katakana');

    expect(updatedKanaCharacters).toEqual([
      { katakana: 'ア', romanji: 'a', weight: 2 },
      { katakana: 'イ', romanji: 'i', weight: 5 },
    ]);
  });

  it('should return original weights if no matching server data is found', () => {
    const initialKanaCharacters: KanaCharacter[] = [
      { katakana: 'ウ', romanji: 'u', weight: 5 },
    ];

    const serverData: ServerData[] = [
      { katakana: 'ア', correct_percentage: 80 },
    ];

    const updatedKanaCharacters = updateWeights(initialKanaCharacters, serverData, 'katakana');

    expect(updatedKanaCharacters).toEqual([
      { katakana: 'ウ', romanji: 'u', weight: 5 },
    ]);
  });

  it('should ensure weight is at least 1', () => {
    const initialKanaCharacters: KanaCharacter[] = [
      { katakana: 'エ', romanji: 'e', weight: 5 },
    ];

    const serverData: ServerData[] = [
      { katakana: 'エ', correct_percentage: 95 },
    ];

    const updatedKanaCharacters = updateWeights(initialKanaCharacters, serverData, 'katakana');

    expect(updatedKanaCharacters).toEqual([
      { katakana: 'エ', romanji: 'e', weight: 1 },
    ]);
  });
});