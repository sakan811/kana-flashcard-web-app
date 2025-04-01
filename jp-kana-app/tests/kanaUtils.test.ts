import { describe, it, expect } from "vitest";
import {
  createFallbackCharacter,
  isRecentlyShown,
  updateKanaHistory,
} from "../src/utils/kanaUtils";
import { KanaType } from "@/types/kana";

describe("KanaUtils", () => {
  describe("createFallbackCharacter", () => {
    it("should create hiragana fallback character", () => {
      const fallback = createFallbackCharacter(KanaType.hiragana);
      expect(fallback.kana).toBe("あ");
      expect(fallback.romaji).toBe("a");
      expect(fallback.type).toBe(KanaType.hiragana);
      expect(fallback.weight).toBe(1);
    });

    it("should create katakana fallback character", () => {
      const fallback = createFallbackCharacter(KanaType.katakana);
      expect(fallback.kana).toBe("ア");
      expect(fallback.romaji).toBe("a");
      expect(fallback.type).toBe(KanaType.katakana);
      expect(fallback.weight).toBe(1);
    });
  });

  describe("isRecentlyShown", () => {
    it("should return true if kana is in history", () => {
      const history = ["あ", "い", "う"];
      expect(isRecentlyShown("あ", history)).toBe(true);
    });

    it("should return false if kana is not in history", () => {
      const history = ["あ", "い", "う"];
      expect(isRecentlyShown("え", history)).toBe(false);
    });

    it("should handle empty history", () => {
      expect(isRecentlyShown("あ", [])).toBe(false);
    });
  });

  describe("updateKanaHistory", () => {
    it("should add new kana to the beginning of history", () => {
      const history = ["あ", "い", "う"];
      const updated = updateKanaHistory("え", history);
      expect(updated).toEqual(["え", "あ", "い", "う"]);
    });

    it("should maintain maximum history size of 5", () => {
      const history = ["あ", "い", "う", "え", "お"];
      const updated = updateKanaHistory("か", history);
      expect(updated).toEqual(["か", "あ", "い", "う", "え"]);
      expect(updated.length).toBe(5);
    });

    it("should handle empty history", () => {
      const updated = updateKanaHistory("あ", []);
      expect(updated).toEqual(["あ"]);
    });

    it("should handle empty kana", () => {
      const history = ["あ", "い", "う"];
      const updated = updateKanaHistory("", history);
      expect(updated).toEqual(history);
    });
  });
});
