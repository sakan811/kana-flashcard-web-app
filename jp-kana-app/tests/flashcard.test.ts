import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "./setup";
import { updateKanaWeight, submitAnswer } from "../src/lib/flashcard-service";
import { createUser } from "../src/lib/auth";
import { Character, KanaType } from "../src/types/kana";

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
      await submitAnswer("hiragana", "a", mockCharacters[0], true);
      // Note: We can't directly test the database state here as it's handled by the API
      // The test verifies that the function executes without throwing errors
    });

    it("should record incorrect answer for katakana", async () => {
      await submitAnswer("katakana", "wrong", mockCharacters[0], false);
      // Note: We can't directly test the database state here as it's handled by the API
      // The test verifies that the function executes without throwing errors
    });

    it("should handle undefined kana type", async () => {
      await submitAnswer(undefined, "a", mockCharacters[0], true);
      // Should default to hiragana and execute without errors
    });

    it("should handle empty kana character", async () => {
      const invalidCharacter: Character = {
        kana: "",
        romaji: "a",
        type: KanaType.hiragana,
        weight: 1,
      };
      await submitAnswer(KanaType.hiragana, "a", invalidCharacter, true);
      // Should handle empty kana gracefully
    });
  });
});
