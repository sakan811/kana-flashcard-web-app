import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "./setup";
import { createUser } from "../src/lib/auth";
import { Character } from "../src/types";
import { KanaType } from "@prisma/client";

describe("Database Operations", () => {
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
    await prisma.userKanaPerformance.deleteMany();
    await prisma.user.deleteMany();
    await prisma.flashcard.deleteMany();
  });

  describe("User Operations", () => {
    it("should create a new user", async () => {
      const user = await createUser(testUser.email, testUser.password);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
      expect(user?.id).toBeDefined();
    });

    it("should not create duplicate users", async () => {
      await createUser(testUser.email, testUser.password);
      const duplicateUser = await createUser(testUser.email, testUser.password);
      expect(duplicateUser).toBeNull();
    });
  });

  describe("User Progress Operations", () => {
    it("should create user progress record", async () => {
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");

      const flashcard = await prisma.flashcard.create({
        data: {
          kana: testCharacter.hiragana!,
          romaji: testCharacter.romanji,
          type: KanaType.hiragana,
        },
      });

      const progress = await prisma.userProgress.create({
        data: {
          userId: user.id,
          flashcardId: flashcard.id,
          correctCount: 1,
          incorrectCount: 0,
          lastPracticed: new Date(),
        },
      });

      expect(progress).toBeDefined();
      expect(progress.userId).toBe(user.id);
      expect(progress.flashcardId).toBe(flashcard.id);
      expect(progress.correctCount).toBe(1);
      expect(progress.incorrectCount).toBe(0);
    });

    it("should update existing progress record", async () => {
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");

      const flashcard = await prisma.flashcard.create({
        data: {
          kana: testCharacter.hiragana!,
          romaji: testCharacter.romanji,
          type: KanaType.hiragana,
        },
      });

      const progress = await prisma.userProgress.create({
        data: {
          userId: user.id,
          flashcardId: flashcard.id,
          correctCount: 1,
          incorrectCount: 0,
          lastPracticed: new Date(),
        },
      });

      const updatedProgress = await prisma.userProgress.update({
        where: { id: progress.id },
        data: {
          correctCount: 2,
          incorrectCount: 1,
          lastPracticed: new Date(),
        },
      });

      expect(updatedProgress.correctCount).toBe(2);
      expect(updatedProgress.incorrectCount).toBe(1);
    });

    it("should get user progress by flashcard", async () => {
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");

      const flashcard = await prisma.flashcard.create({
        data: {
          kana: testCharacter.hiragana!,
          romaji: testCharacter.romanji,
          type: KanaType.hiragana,
        },
      });

      await prisma.userProgress.create({
        data: {
          userId: user.id,
          flashcardId: flashcard.id,
          correctCount: 1,
          incorrectCount: 0,
          lastPracticed: new Date(),
        },
      });

      const progress = await prisma.userProgress.findFirst({
        where: {
          userId: user.id,
          flashcardId: flashcard.id,
        },
      });

      expect(progress).toBeDefined();
      expect(progress?.flashcardId).toBe(flashcard.id);
    });

    it("should get all progress for a user", async () => {
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");

      const flashcard = await prisma.flashcard.create({
        data: {
          kana: testCharacter.hiragana!,
          romaji: testCharacter.romanji,
          type: KanaType.hiragana,
        },
      });

      await prisma.userProgress.create({
        data: {
          userId: user.id,
          flashcardId: flashcard.id,
          correctCount: 1,
          incorrectCount: 0,
          lastPracticed: new Date(),
        },
      });

      const progress = await prisma.userProgress.findMany({
        where: { userId: user.id },
      });

      expect(progress).toHaveLength(1);
      expect(progress[0].userId).toBe(user.id);
    });
  });

  describe("User Kana Performance Operations", () => {
    it("should create kana performance record", async () => {
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");

      const performance = await prisma.userKanaPerformance.create({
        data: {
          userId: user.id,
          kana: testCharacter.hiragana!,
          kanaType: "hiragana",
          correctCount: 1,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });

      expect(performance).toBeDefined();
      expect(performance.userId).toBe(user.id);
      expect(performance.kana).toBe(testCharacter.hiragana);
      expect(performance.correctCount).toBe(1);
      expect(performance.totalCount).toBe(1);
    });

    it("should update existing kana performance record", async () => {
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");

      const performance = await prisma.userKanaPerformance.create({
        data: {
          userId: user.id,
          kana: testCharacter.hiragana!,
          kanaType: "hiragana",
          correctCount: 1,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });

      const updatedPerformance = await prisma.userKanaPerformance.update({
        where: { id: performance.id },
        data: {
          correctCount: 2,
          totalCount: 3,
          lastPracticed: new Date(),
        },
      });

      expect(updatedPerformance.correctCount).toBe(2);
      expect(updatedPerformance.totalCount).toBe(3);
    });
  });
});
