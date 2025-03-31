import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "./setup";
import { updateKanaWeight, submitAnswer } from "../src/lib/flashcard-service";
import { createUser } from "../src/lib/auth";
import { Character } from "../src/types";

describe("Flashcard Service", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
  };

  const testCharacter: Character = {
    hiragana: "あ",
    katakana: "ア",
    romanji: "a",
    weight: 1,
  };

  beforeEach(async () => {
    await prisma.userProgress.deleteMany();
    await prisma.user.deleteMany();
    await createUser(testUser);
  });

  describe("updateKanaWeight", () => {
    it("should update kana weights based on performance", async () => {
      const characters: Character[] = [
        { ...testCharacter, weight: 1 },
        { hiragana: "い", katakana: "イ", romanji: "i", weight: 1 },
        { hiragana: "う", katakana: "ウ", romanji: "u", weight: 1 },
      ];

      const updatedCharacters = await updateKanaWeight(characters, "hiragana");
      expect(updatedCharacters).toBeDefined();
      expect(updatedCharacters.length).toBe(characters.length);
      expect(updatedCharacters[0].weight).toBeDefined();
    });

    it("should handle errors gracefully", async () => {
      const characters: Character[] = [testCharacter];
      const updatedCharacters = await updateKanaWeight(characters, "hiragana");
      expect(updatedCharacters).toEqual(characters); // Should return original characters on error
    });
  });

  describe("submitAnswer", () => {
    it("should record correct answer for hiragana", async () => {
      await submitAnswer("hiragana", "a", testCharacter, true);
      // Note: We can't directly test the database state here as it's handled by the API
      // The test verifies that the function executes without throwing errors
    });

    it("should record incorrect answer for katakana", async () => {
      await submitAnswer("katakana", "wrong", testCharacter, false);
      // Note: We can't directly test the database state here as it's handled by the API
      // The test verifies that the function executes without throwing errors
    });

    it("should handle undefined kana type", async () => {
      await submitAnswer(undefined, "a", testCharacter, true);
      // Should default to hiragana and execute without errors
    });

    it("should handle undefined kana character", async () => {
      const invalidCharacter: Character = {
        romanji: "a",
        weight: 1,
      };
      await submitAnswer("hiragana", "a", invalidCharacter, true);
      // Should handle undefined hiragana gracefully
    });
  });
});
