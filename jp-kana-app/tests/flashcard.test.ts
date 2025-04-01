import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "./setup";
import { updateKanaWeight, submitAnswer } from "../src/lib/flashcard-service";
import { createUser } from "../src/lib/auth";
import { Character, KanaType } from "../src/types/kana";
import { createFallbackCharacter } from "../src/utils/kanaUtils";

describe("Flashcard Service", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
  };

  const mockCharacters: Character[] = [
    { kana: "あ", romaji: "a", type: KanaType.hiragana, weight: 1 },
    { kana: "い", romaji: "i", type: KanaType.hiragana, weight: 1 },
    { kana: "う", romaji: "u", type: KanaType.hiragana, weight: 1 },
  ];

  beforeEach(async () => {
    await prisma.userProgress.deleteMany();
    await prisma.userKanaPerformance.deleteMany();
    await prisma.user.deleteMany();
    await createUser(testUser.email, testUser.password);
  });

  describe("updateKanaWeight", () => {
    it("should update kana weights based on performance", async () => {
      const characters: Character[] = [
        { ...mockCharacters[0], weight: 1 },
        { ...mockCharacters[1], weight: 1 },
        { ...mockCharacters[2], weight: 1 },
      ];

      const updatedCharacters = await updateKanaWeight(characters);
      expect(updatedCharacters).toBeDefined();
      expect(updatedCharacters.length).toBe(characters.length);
      expect(updatedCharacters[0].weight).toBeDefined();
    });

    it("should handle errors gracefully", async () => {
      const characters: Character[] = [mockCharacters[0]];
      const updatedCharacters = await updateKanaWeight(characters);
      expect(updatedCharacters).toEqual(characters); // Should return original characters on error
    });
  });

  describe("submitAnswer", () => {
    it("should record correct answer for hiragana", async () => {
      await submitAnswer(
        KanaType.hiragana,
        "a",
        mockCharacters[0],
        true,
        testUser.email,
      );
      // Test verifies function executes without throwing errors
    });

    it("should record incorrect answer for katakana", async () => {
      await submitAnswer(
        KanaType.katakana,
        "wrong",
        mockCharacters[0],
        false,
        testUser.email,
      );
      // Test verifies function executes without throwing errors
    });

    it("should handle undefined kana type", async () => {
      await submitAnswer(
        undefined,
        "a",
        mockCharacters[0],
        true,
        testUser.email,
      );
      // Should default to hiragana and execute without errors
    });

    it("should handle empty kana character", async () => {
      const invalidCharacter: Character = {
        kana: "",
        romaji: "a",
        type: KanaType.hiragana,
        weight: 1,
      };

      await expect(
        submitAnswer(
          KanaType.hiragana,
          "a",
          invalidCharacter,
          true,
          testUser.email,
        ),
      ).rejects.toThrow();
    });

    it("should use fallback character when needed", async () => {
      const fallbackChar = createFallbackCharacter(KanaType.hiragana);
      await submitAnswer(
        KanaType.hiragana,
        "a",
        fallbackChar,
        true,
        testUser.email,
      );
      // Test verifies function executes without throwing errors with fallback character
    });
  });
});
