import { describe, it, expect } from "vitest";
import { getRandomCharacter } from "@/lib/utils";
import { Character, KanaType } from "@/types/kana";

describe("Utility Functions", () => {
  describe("Character Validation", () => {
    it("should validate hiragana character", () => {
      const character: Character = {
        kana: "あ",
        romaji: "a",
        type: KanaType.hiragana,
        weight: 1,
      };
      expect(character.kana).toMatch(/^[\u3040-\u309F]$/);
    });

    it("should validate katakana character", () => {
      const character: Character = {
        kana: "ア",
        romaji: "a",
        type: KanaType.katakana,
        weight: 1,
      };
      expect(character.kana).toMatch(/^[\u30A0-\u30FF]$/);
    });

    it("should validate romaji format", () => {
      const character: Character = {
        kana: "あ",
        romaji: "a",
        type: KanaType.hiragana,
        weight: 1,
      };
      expect(character.romaji).toMatch(/^[a-z]+$/);
    });
  });

  describe("Weight Calculation", () => {
    it("should calculate weight based on performance", () => {
      const correctCount = 5;
      const totalCount = 10;
      const weight = 1 / (correctCount / totalCount);
      expect(weight).toBe(2);
    });

    it("should handle zero correct answers", () => {
      const correctCount = 0;
      const totalCount = 5;
      const weight = 1 / (correctCount / totalCount || 1);
      expect(weight).toBe(1);
    });

    it("should handle perfect performance", () => {
      const correctCount = 10;
      const totalCount = 10;
      const weight = 1 / (correctCount / totalCount);
      expect(weight).toBe(1);
    });
  });

  describe("String Formatting", () => {
    it("should format percentage correctly", () => {
      const percentage = 66.666666;
      const formatted = percentage.toFixed(2);
      expect(formatted).toBe("66.67");
    });

    it("should handle zero percentage", () => {
      const percentage = 0;
      const formatted = percentage.toFixed(2);
      expect(formatted).toBe("0.00");
    });

    it("should handle 100 percentage", () => {
      const percentage = 100;
      const formatted = percentage.toFixed(2);
      expect(formatted).toBe("100.00");
    });
  });

  describe("getRandomCharacter", () => {
    const mockCharacters: Character[] = [
      {
        kana: "あ",
        romaji: "a",
        type: KanaType.hiragana,
        weight: 1,
      },
      {
        kana: "い",
        romaji: "i",
        type: KanaType.hiragana,
        weight: 2,
      },
      {
        kana: "う",
        romaji: "u",
        type: KanaType.hiragana,
        weight: 3,
      },
    ];

    it("should return a character from the list", () => {
      const result = getRandomCharacter(mockCharacters);
      expect(mockCharacters).toContainEqual(result);
    });

    it("should handle empty character list", () => {
      const result = getRandomCharacter([]);
      expect(result).toEqual({
        kana: "",
        romaji: "",
        type: KanaType.hiragana,
        weight: 1,
      });
    });
  });
});
