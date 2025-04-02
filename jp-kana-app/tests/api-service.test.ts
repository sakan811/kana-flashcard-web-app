import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getRandomKana,
  getKanaPerformance,
  recordKanaPerformance,
  getKanaWithWeights,
} from "../src/lib/api-service";
import { Character, KanaPerformanceData, KanaType } from "@/types/kana";

// Mock fetch and cache
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the cache module
vi.mock("../src/constants", () => ({
  CACHE_DURATION: 60000, // 1 minute in milliseconds
}));

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
    // Ensure all fetch calls return proper JSON methods
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );
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
        json: () => Promise.resolve({}),
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
      // First call should make a fetch request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPerformanceData]),
      });

      // First call to populate cache
      await getKanaPerformance("test-user", "hiragana");

      // Reset mock to verify it's not called again
      mockFetch.mockClear();

      // Second call should use cache and not call fetch again
      const result = await getKanaPerformance("test-user", "hiragana");

      expect(result).toEqual([mockPerformanceData]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("recordKanaPerformance", () => {
    it("should record performance successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await recordKanaPerformance("test-user-id", "あ", "hiragana", true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/record-performance"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"userId":"test-user-id"'),
          credentials: "include",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Server Error",
        json: () => Promise.reject(new Error("Server Error")),
      });

      await expect(
        recordKanaPerformance("test-user-id", "あ", "hiragana", true),
      ).rejects.toThrow();
    });

    it("should handle authentication errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: () =>
          Promise.resolve({ error: "No authenticated session found" }),
      });

      await expect(
        recordKanaPerformance("test-user-id", "あ", "hiragana", true),
      ).rejects.toThrow("No authenticated session found");
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
        json: () => Promise.resolve({}),
      });

      await expect(
        getKanaWithWeights(characters, "test-user", "hiragana"),
      ).rejects.toThrow();
    });
  });
});
