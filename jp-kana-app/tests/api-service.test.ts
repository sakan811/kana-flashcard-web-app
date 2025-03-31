import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getRandomKana,
  getKanaPerformance,
  recordKanaPerformance,
  getKanaWithWeights,
} from "../src/lib/api-service";
import { Character, KanaPerformanceData } from "../src/types";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("API Service", () => {
  const testCharacter: Character = {
    hiragana: "あ",
    katakana: "ア",
    romanji: "a",
    weight: 1,
  };

  const testPerformanceData: KanaPerformanceData = {
    kana: "あ",
    kanaType: "hiragana",
    correctCount: 5,
    totalCount: 10,
    accuracy: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRandomKana", () => {
    it("should fetch random kana successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: testCharacter,
          }),
      });

      const result = await getRandomKana("test-user", "hiragana");
      expect(result).toEqual(testCharacter);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/random-kana"),
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(getRandomKana("test-user", "hiragana")).rejects.toThrow();
    });
  });

  describe("getKanaPerformance", () => {
    it("should fetch performance data successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([testPerformanceData]),
      });

      const result = await getKanaPerformance("test-user", "hiragana");
      expect(result).toEqual([testPerformanceData]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/kana-performance"),
      );
    });

    it("should use cached data when available", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([testPerformanceData]),
      });

      // First call
      await getKanaPerformance("test-user", "hiragana");
      // Second call should use cache
      const result = await getKanaPerformance("test-user", "hiragana");

      expect(result).toEqual([testPerformanceData]);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("recordKanaPerformance", () => {
    it("should record performance successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await recordKanaPerformance("test-user", "あ", "hiragana", true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/record-performance"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("あ"),
        }),
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Server Error",
      });

      await expect(
        recordKanaPerformance("test-user", "あ", "hiragana", true),
      ).rejects.toThrow();
    });
  });

  describe("getKanaWithWeights", () => {
    it("should fetch kana with weights successfully", async () => {
      const characters = [testCharacter];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(characters),
      });

      const result = await getKanaWithWeights(
        characters,
        "test-user",
        "hiragana",
      );
      expect(result).toEqual(characters);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/kana-weights"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("test-user"),
        }),
      );
    });

    it("should handle API errors", async () => {
      const characters = [testCharacter];
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Server Error",
      });

      await expect(
        getKanaWithWeights(characters, "test-user", "hiragana"),
      ).rejects.toThrow();
    });
  });
});
