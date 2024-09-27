import { Character } from "@/components/funcs/utilsFunc";
import {initializeKanaPerformanceData} from "../../src/components/funcs/showKanaFunc";
import {it, expect} from 'vitest';

it("should initialize performance data with correct kana when kanaType is 'hiragana'", () => {
    const initialKanaCharacters = [
        {hiragana: "￣ﾁﾂ", katakana: "￣ﾂﾢ", romanji: "a", weight: 1},
        {hiragana: "￣ﾁﾄ", katakana: "￣ﾂﾤ", romanji: "i", weight: 1}
    ];
    const result = initializeKanaPerformanceData('hiragana', initialKanaCharacters);
    expect(result).toEqual([
        {kana: "￣ﾁﾂ", romanji: "a", correct_answer: 0, total_answer: 0, accuracy: 0},
        {kana: "￣ﾁﾄ", romanji: "i", correct_answer: 0, total_answer: 0, accuracy: 0}
    ]);
});

// Initializes performance data with correct romanji for each character
it("should initialize performance data with correct romanji for each character", () => {
    const initialKanaCharacters = [
        {hiragana: "￣ﾁﾂ", katakana: "￣ﾂﾢ", romanji: "a", weight: 1},
        {hiragana: "￣ﾁﾄ", katakana: "￣ﾂﾤ", romanji: "i", weight: 1}
    ];
    const result = initializeKanaPerformanceData('hiragana', initialKanaCharacters);
    expect(result).toEqual([
        {kana: "￣ﾁﾂ", romanji: "a", correct_answer: 0, total_answer: 0, accuracy: 0},
        {kana: "￣ﾁﾄ", romanji: "i", correct_answer: 0, total_answer: 0, accuracy: 0}
    ]);
});

// Handles an empty array of initialKanaCharacters
it("should return an empty array when initialKanaCharacters is empty", () => {
    const initialKanaCharacters: Character[] = [];
    const result = initializeKanaPerformanceData('hiragana', initialKanaCharacters);
    expect(result).toEqual([]);
});

// Handles undefined kanaType
it("should return performance data with undefined kana when kanaType is undefined", () => {
    const initialKanaCharacters = [
        { hiragana: "￣ﾁﾂ", katakana: "￣ﾂﾢ", romanji: "a", weight: 1 },
        { hiragana: "￣ﾁﾄ", katakana: "￣ﾂﾤ", romanji: "i", weight: 1 }
    ];
    const result = initializeKanaPerformanceData(undefined, initialKanaCharacters);
    expect(result).toEqual([
        { kana: undefined, romanji: "a", correct_answer: 0, total_answer: 0, accuracy: 0 },
        { kana: undefined, romanji: "i", correct_answer: 0, total_answer: 0, accuracy: 0 }
    ]);
});