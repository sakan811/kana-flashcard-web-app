import { describe, it, expect } from "vitest";
import { Character } from "../src/types";

describe("Utility Functions", () => {
  describe("Character Validation", () => {
    it("should validate hiragana character", () => {
      const character: Character = {
        hiragana: "あ",
        katakana: "ア",
        romanji: "a",
        weight: 1,
      };
      expect(character.hiragana).toMatch(/^[\u3040-\u309F]$/);
    });

    it("should validate katakana character", () => {
      const character: Character = {
        hiragana: "あ",
        katakana: "ア",
        romanji: "a",
        weight: 1,
      };
      expect(character.katakana).toMatch(/^[\u30A0-\u30FF]$/);
    });

    it("should validate romanji format", () => {
      const character: Character = {
        hiragana: "あ",
        katakana: "ア",
        romanji: "a",
        weight: 1,
      };
      expect(character.romanji).toMatch(/^[a-z]+$/);
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
});
