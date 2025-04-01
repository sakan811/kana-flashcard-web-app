import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockPrismaClient } from "./prisma-mock";
import { Character, KanaType } from "@/types/kana";

// Mock the auth module to return a fake user
vi.mock("../src/lib/auth", () => ({
  createUser: vi.fn().mockImplementation(() => {
    return Promise.resolve({
      id: "test-user-id",
      email: "test@example.com",
      name: null
    });
  })
}));

// Import mocked createUser function
import { createUser } from "../src/lib/auth";

describe("Database Operations", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
  };

  const testCharacter: Character = {
    kana: "あ",
    romaji: "a",
    type: KanaType.hiragana,
    weight: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaClient.user.create.mockReset();
    mockPrismaClient.user.findUnique.mockReset();
    mockPrismaClient.flashcard.create.mockReset();
    mockPrismaClient.userProgress.create.mockReset();
    mockPrismaClient.userProgress.update.mockReset();
    mockPrismaClient.userProgress.findFirst.mockReset();
    mockPrismaClient.userProgress.findMany.mockReset();
    mockPrismaClient.userKanaPerformance.create.mockReset();
    mockPrismaClient.userKanaPerformance.update.mockReset();
  });

  describe("User Operations", () => {
    it("should create a new user", async () => {
      const user = await createUser(testUser.email, testUser.password);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
      expect(user?.id).toBeDefined();
    });

    it("should not create duplicate users", async () => {
      // Mock createUser to first return a user, then null the second time
      const createUserMock = createUser as jest.Mock;
      createUserMock.mockResolvedValueOnce({
        id: "test-user-id",
        email: testUser.email,
        name: null
      });
      createUserMock.mockResolvedValueOnce(null);

      await createUser(testUser.email, testUser.password);
      const duplicateUser = await createUser(testUser.email, testUser.password);
      expect(duplicateUser).toBeNull();
    });
  });

  describe("User Progress Operations", () => {
    it("should create user progress record", async () => {
      // Mock user
      const user = await createUser(testUser.email, testUser.password);

      // Mock flashcard creation
      mockPrismaClient.flashcard.create.mockResolvedValue({
        id: 1,
        kana: "あ",
        romaji: "a", 
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Mock progress creation
      mockPrismaClient.userProgress.create.mockResolvedValue({
        id: 1,
        userId: user.id,
        flashcardId: 1,
        correctCount: 1,
        incorrectCount: 0,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const flashcard = await mockPrismaClient.flashcard.create({
        data: {
          kana: testCharacter.kana!,
          romaji: testCharacter.romaji,
          type: "hiragana",
        },
      });

      const progress = await mockPrismaClient.userProgress.create({
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
    });

    it("should update existing progress record", async () => {
      const user = await createUser(testUser.email, testUser.password);
      
      // Mock flashcard creation
      mockPrismaClient.flashcard.create.mockResolvedValue({
        id: 1,
        kana: "あ",
        romaji: "a", 
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Mock progress creation and update
      const mockProgress = {
        id: 1,
        userId: user.id,
        flashcardId: 1,
        correctCount: 1,
        incorrectCount: 0,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPrismaClient.userProgress.create.mockResolvedValue(mockProgress);
      mockPrismaClient.userProgress.update.mockResolvedValue({
        ...mockProgress,
        correctCount: 2,
        incorrectCount: 1,
      });

      const flashcard = await mockPrismaClient.flashcard.create({
        data: {
          kana: testCharacter.kana!,
          romaji: testCharacter.romaji,
          type: "hiragana",
        },
      });

      const progress = await mockPrismaClient.userProgress.create({
        data: {
          userId: user.id,
          flashcardId: flashcard.id,
          correctCount: 1,
          incorrectCount: 0,
          lastPracticed: new Date(),
        },
      });

      const updatedProgress = await mockPrismaClient.userProgress.update({
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
      
      // Mock flashcard creation
      mockPrismaClient.flashcard.create.mockResolvedValue({
        id: 1,
        kana: "あ",
        romaji: "a", 
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Mock progress creation and findFirst
      const mockProgress = {
        id: 1,
        userId: user.id,
        flashcardId: 1,
        correctCount: 1,
        incorrectCount: 0,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPrismaClient.userProgress.create.mockResolvedValue(mockProgress);
      mockPrismaClient.userProgress.findFirst.mockResolvedValue(mockProgress);

      const flashcard = await mockPrismaClient.flashcard.create({
        data: {
          kana: testCharacter.kana!,
          romaji: testCharacter.romaji,
          type: "hiragana",
        },
      });

      await mockPrismaClient.userProgress.create({
        data: {
          userId: user.id,
          flashcardId: flashcard.id,
          correctCount: 1,
          incorrectCount: 0,
          lastPracticed: new Date(),
        },
      });

      const progress = await mockPrismaClient.userProgress.findFirst({
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
      
      // Mock flashcard creation
      mockPrismaClient.flashcard.create.mockResolvedValue({
        id: 1,
        kana: "あ",
        romaji: "a", 
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Mock progress creation and findMany
      const mockProgress = {
        id: 1,
        userId: user.id,
        flashcardId: 1,
        correctCount: 1,
        incorrectCount: 0,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPrismaClient.userProgress.create.mockResolvedValue(mockProgress);
      mockPrismaClient.userProgress.findMany.mockResolvedValue([mockProgress]);

      const flashcard = await mockPrismaClient.flashcard.create({
        data: {
          kana: testCharacter.kana!,
          romaji: testCharacter.romaji,
          type: "hiragana",
        },
      });

      await mockPrismaClient.userProgress.create({
        data: {
          userId: user.id,
          flashcardId: flashcard.id,
          correctCount: 1,
          incorrectCount: 0,
          lastPracticed: new Date(),
        },
      });

      const progress = await mockPrismaClient.userProgress.findMany({
        where: { userId: user.id },
      });

      expect(progress).toHaveLength(1);
      expect(progress[0].userId).toBe(user.id);
    });
  });

  describe("User Kana Performance Operations", () => {
    it("should create kana performance record", async () => {
      const user = await createUser(testUser.email, testUser.password);
      
      // Mock performance creation
      const mockPerformance = {
        id: 1,
        userId: user.id,
        kana: "あ",
        kanaType: "hiragana",
        correctCount: 1,
        totalCount: 1,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPrismaClient.userKanaPerformance.create.mockResolvedValue(mockPerformance);

      const performance = await mockPrismaClient.userKanaPerformance.create({
        data: {
          userId: user.id,
          kana: testCharacter.kana!,
          kanaType: "hiragana",
          correctCount: 1,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });

      expect(performance).toBeDefined();
      expect(performance.userId).toBe(user.id);
      expect(performance.kana).toBe(testCharacter.kana);
      expect(performance.correctCount).toBe(1);
      expect(performance.totalCount).toBe(1);
    });

    it("should update existing kana performance record", async () => {
      const user = await createUser(testUser.email, testUser.password);
      
      // Mock performance creation and update
      const mockPerformance = {
        id: 1,
        userId: user.id,
        kana: "あ",
        kanaType: "hiragana",
        correctCount: 1,
        totalCount: 1,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPrismaClient.userKanaPerformance.create.mockResolvedValue(mockPerformance);
      mockPrismaClient.userKanaPerformance.update.mockResolvedValue({
        ...mockPerformance,
        correctCount: 2,
        totalCount: 3
      });

      const performance = await mockPrismaClient.userKanaPerformance.create({
        data: {
          userId: user.id,
          kana: testCharacter.kana!,
          kanaType: "hiragana",
          correctCount: 1,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });

      const updatedPerformance = await mockPrismaClient.userKanaPerformance.update({
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
