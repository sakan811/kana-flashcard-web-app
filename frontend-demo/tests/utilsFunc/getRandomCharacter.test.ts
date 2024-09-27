import {describe, it, expect, beforeEach, afterEach, Mock, vi} from 'vitest';
import {getRandomCharacter} from "../../src/components/funcs/utilsFunc";


// Sample character data for testing
const characterData = [
  { hiragana: 'あ', romanji: 'a', weight: 1 },
  { hiragana: 'い', romanji: 'i', weight: 3 },
  { hiragana: 'う', romanji: 'u', weight: 6 },
];

describe('getRandomCharacter', () => {
  // Store the original Math.random function
  const originalRandom = Math.random;

  // Before each test, override Math.random
  beforeEach(() => {
    Math.random = vi.fn();
  });

  // After each test, restore the original Math.random function
  afterEach(() => {
    Math.random = originalRandom;
  });

  it('should return a character based on weight', () => {
    // Mock Math.random to return a value favoring 'あ'
    (Math.random as Mock).mockReturnValue(0.1);

    const result = getRandomCharacter(characterData);
    expect(result).toEqual(characterData[0]); // Should favor 'あ'
  });

  it('should return a character with higher weight', () => {
    // Mock Math.random to return a value favoring 'い'
    (Math.random as Mock).mockReturnValue(0.4);

    const result = getRandomCharacter(characterData);
    expect(result).toEqual(characterData[1]); // Should favor 'い'
  });

  it('should return the character with the highest weight', () => {
    // Mock Math.random to return a value favoring 'う'
    (Math.random as Mock).mockReturnValue(0.8);

    const result = getRandomCharacter(characterData);
    expect(result).toEqual(characterData[2]); // Should favor 'う'
  });

  it('should return the last character in case of rounding errors', () => {
    // Mock Math.random to return a value that exceeds total weight
    (Math.random as Mock).mockReturnValue(1.5);

    const result = getRandomCharacter(characterData);
    expect(result).toEqual(characterData[characterData.length - 1]); // Should return 'う'
  });

  it('should handle an empty character array gracefully', () => {
    const result = getRandomCharacter([]); // Decide what should happen here
    expect(result).toBeUndefined(); // Or handle it as needed
  });
});
