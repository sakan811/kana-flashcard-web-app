import {describe, it, expect, vi, Mock} from 'vitest';
import axios from 'axios';
import {updateKanaWeight} from "../../src/components/funcs/showKanaFunc";

interface KanaCharacter {
  katakana: string;
  romanji: string;
  weight: number;
}

// Mock axios
vi.mock('axios');

describe('updateKanaWeight', () => {
    const initialKanaCharacters: KanaCharacter[] = [
        { katakana: 'ア', romanji: 'a', weight: 5 },
        { katakana: 'イ', romanji: 'i', weight: 5 },
        { katakana: 'ウ', romanji: 'u', weight: 5 },
    ];

    it('should update weights based on server data', async () => {
    // Mock the response from axios
    const serverResponse = [
      { katakana: 'ア', correct_percentage: 90 },
      { katakana: 'イ', correct_percentage: 80 },
      { katakana: 'ウ', correct_percentage: 70 },
    ];
    (axios.get as Mock).mockResolvedValueOnce({ data: serverResponse });

    const updatedKana = await updateKanaWeight(initialKanaCharacters, 'katakana');

    // Check that the weights were updated correctly
    expect(updatedKana).toEqual([
      { katakana: 'ア', romanji: 'a', weight: 1 },  // (100 - 90) / 10 = 1
      { katakana: 'イ', romanji: 'i', weight: 2 },  // (100 - 80) / 10 = 2
      { katakana: 'ウ', romanji: 'u', weight: 3 },  // (100 - 70) / 10 = 3
    ]);
    });

    it('should return initial weights if fetch fails', async () => {
    (axios.get as Mock).mockRejectedValueOnce(new Error('Network Error'));

    const updatedKana = await updateKanaWeight(initialKanaCharacters, 'katakana');

    // Check that the original weights are returned
    expect(updatedKana).toEqual(initialKanaCharacters);
    });

    it('should return initial weights if update fails', async () => {
        const serverResponse = [
            { katakana: 'ア', correct_percentage: 90 },
        ];
        (axios.get as Mock).mockResolvedValueOnce({ data: serverResponse });

        const updatedKana = await updateKanaWeight(initialKanaCharacters, 'katakana');

        const expectedKanaCharacters: KanaCharacter[] = [
            { katakana: 'ア', romanji: 'a', weight: 1 },
            { katakana: 'イ', romanji: 'i', weight: 5 },
            { katakana: 'ウ', romanji: 'u', weight: 5 },
        ];

        // Check that the original weights are returned
        expect(updatedKana).toEqual(expectedKanaCharacters);
    });
});
