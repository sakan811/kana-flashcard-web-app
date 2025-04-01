import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getRandomKana,
  getKanaPerformance,
  recordKanaPerformance,
  getKanaWithWeights,
} from "../src/lib/api-service";
import { Character, KanaPerformanceData, KanaType } from "@/types/kana";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("API Service", () => {
  const mockCharacter: Character = {
    kana: "あ",
    romaji: "a",
    type: KanaType.hiragana,
    weight: 1,
  };

  const mockPerformanceData: KanaPerformanceData = {
    id: 1,
    userId: "test-user",
    kana: "あ",
    kanaType: KanaType.hiragana,
    correctCount: 5,
    totalCount: 10,
    accuracy: 0.5,
    percentage: 50,
    lastPracticed: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
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
            data: mockCharacter,
          }),
      });

      const result = await getRandomKana("test-user", "hiragana");
      expect(result).toEqual(mockCharacter);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/random-kana"),
        expect.objectContaining({
          credentials: "include",
        }),
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(getRandomKana("test-user", "hiragana")).rejects.toThrow();
    });

    it("should handle success=false in response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            error: "Error message",
          }),
      });

      await expect(getRandomKana("test-user", "hiragana")).rejects.toThrow(
        "Error message",
      );
    });
  });

  describe("getKanaPerformance", () => {
    it("should fetch performance data successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPerformanceData]),
      });

      const result = await getKanaPerformance("test-user", "hiragana");
      expect(result).toEqual([mockPerformanceData]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/kana-performance"),
        expect.objectContaining({
          credentials: "include",
        }),
      );
    });

    it("should use cached data when available", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPerformanceData]),
      });

      // First call
      await getKanaPerformance("test-user", "hiragana");
      // Second call should use cache
      const result = await getKanaPerformance("test-user", "hiragana");

      expect(result).toEqual([mockPerformanceData]);
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
          credentials: "include",
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
      const characters = [mockCharacter];
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
          credentials: "include",
        }),
      );
    });

    it("should handle API errors", async () => {
      const characters = [mockCharacter];
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
