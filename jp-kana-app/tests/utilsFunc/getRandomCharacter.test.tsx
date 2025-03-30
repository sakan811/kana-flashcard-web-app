import { describe, it, expect } from 'vitest';
import { getRandomCharacter } from "../../src/components/funcs/utilsFunc";

interface Character {
  character: 'あ' | 'い' | 'う';
  romanji: string;
  weight: number;
}

describe('getRandomCharacter', () => {
  it('should return a character based on weight distribution', () => {
    const characters: Character[] = [
      { character: 'あ', romanji: 'a', weight: 1 },
      { character: 'い', romanji: 'i', weight: 2 },
      { character: 'う', romanji: 'u', weight: 3 },
    ];

    const result = getRandomCharacter(characters);

    expect(result).toBeDefined();
    expect(characters).toContain(result);
  });

  it('should handle rounding error edge cases gracefully', () => {
    const characters: Character[] = [
      { character: 'あ', romanji: 'a', weight: 0.3333333333 },
      { character: 'い', romanji: 'i', weight: 0.3333333333 },
      { character: 'う', romanji: 'u', weight: 0.3333333333 },
    ];

    const result = getRandomCharacter(characters);

    expect(result).toBeDefined();
    expect(characters).toContain(result);
  });

  it('should return the last character when rounding errors occur', () => {
    const characters: Character[] = [
      { character: 'あ', romanji: 'a', weight: 0.0000000001 },
      { character: 'い', romanji: 'i', weight: 0.0000000001 },
      { character: 'う', romanji: 'u', weight: 0.0000000001 },
    ];

    // Define a type for the keys of selectionCount
    type CharacterKey = 'あ' | 'い' | 'う';

    // Explicitly type the selectionCount object
    const selectionCount: Record<CharacterKey, number> = {
      'あ': 0,
      'い': 0,
      'う': 0,
    };

    // Run the function multiple times to test for random selection
    const iterations = 10000; // You can adjust this number
    for (let i = 0; i < iterations; i++) {
      const result: Character = getRandomCharacter(characters) as Character;
      selectionCount[result.character]++;
    }

    // Expect the last character to have been selected at least once
    expect(selectionCount['う']).toBeGreaterThan(0);
    expect(selectionCount['あ']).toBeGreaterThan(0);
    expect(selectionCount['い']).toBeGreaterThan(0);
  });

  it('should handle very large weights properly', () => {
    const characters: Character[] = [
      { character: 'あ', romanji: 'a', weight: 1e10 },
      { character: 'い', romanji: 'i', weight: 1e10 },
      { character: 'う', romanji: 'u', weight: 1e10 },
    ];

    const result = getRandomCharacter(characters);

    expect(result).toBeDefined();
    expect(characters).toContain(result);
  });
});