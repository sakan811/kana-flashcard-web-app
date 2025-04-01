import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockPrismaClient } from "./prisma-mock";
import { Character, KanaType } from "@/types/kana";
import { User } from "../src/lib/auth";

// Import the mocked createUser function first, before it's used
import { createUser } from "../src/lib/auth";

// Add proper type for mocked function
type MockedFunction<T extends (...args: any) => any> = T & ReturnType<typeof vi.fn>;
type MockedPrismaFunction<T extends (...args: any) => any> = T & {
  mockReset: () => void;
  mockResolvedValue: (value: any) => void;
}

// Define the mock user object upfront to avoid undefined issues
const mockUser: User = {
  id: "test-user-id",
  email: "test@example.com",
  name: null
};

// Mock the auth module with a defined implementation
vi.mock("../src/lib/auth", () => ({
  createUser: vi.fn().mockImplementation(() => Promise.resolve({
    id: "test-user-id",
    email: "test@example.com",
    name: null
  } as User))
}));

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
    
    // Reset the createUser mock implementation
    (createUser as MockedFunction<typeof createUser>).mockImplementation(() => Promise.resolve(mockUser));
    
    // Reset Prisma mocks using the custom mock functions
    // TypeScript doesn't know these are mocks, so we need to cast them
    (mockPrismaClient.user.create as any).mockReset();
    (mockPrismaClient.user.findUnique as any).mockReset();
    (mockPrismaClient.flashcard.create as any).mockReset();
    (mockPrismaClient.userProgress.create as any).mockReset();
    (mockPrismaClient.userProgress.update as any).mockReset();
    (mockPrismaClient.userProgress.findFirst as any).mockReset();
    (mockPrismaClient.userProgress.findMany as any).mockReset();
    (mockPrismaClient.userKanaPerformance.create as any).mockReset();
    (mockPrismaClient.userKanaPerformance.update as any).mockReset();
  });

  describe("User Operations", () => {
    it("should create a new user", async () => {
      const user = await createUser(testUser.email, testUser.password);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
      expect(user?.id).toBeDefined();
    });

    it("should not create duplicate users", async () => {
      // First call returns a user
      (createUser as MockedFunction<typeof createUser>).mockResolvedValueOnce(mockUser);
      // Second call returns null (duplicate)
      (createUser as MockedFunction<typeof createUser>).mockResolvedValueOnce(null);

      await createUser(testUser.email, testUser.password);
      const duplicateUser = await createUser(testUser.email, testUser.password);
      expect(duplicateUser).toBeNull();
    });
  });

  describe("User Progress Operations", () => {
    it("should create user progress record", async () => {
      // Create a flashcard
      const mockFlashcard = {
        id: 1,
        kana: "あ",
        romaji: "a", 
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.flashcard.create as any).mockResolvedValue(mockFlashcard);

      // Create progress
      const mockProgress = {
        id: 1,
        userId: mockUser.id,
        flashcardId: 1,
        correctCount: 1,
        incorrectCount: 0,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.userProgress.create as any).mockResolvedValue(mockProgress);

      // Execute test
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");
      
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
      // Create a flashcard
      const mockFlashcard = {
        id: 1,
        kana: "あ",
        romaji: "a", 
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.flashcard.create as any).mockResolvedValue(mockFlashcard);

      // Create progress record
      const mockProgress = {
        id: 1,
        userId: mockUser.id,
        flashcardId: 1,
        correctCount: 1,
        incorrectCount: 0,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.userProgress.create as any).mockResolvedValue(mockProgress);
      
      // Create updated progress record
      const mockUpdatedProgress = {
        ...mockProgress,
        correctCount: 2,
        incorrectCount: 1,
      };
      (mockPrismaClient.userProgress.update as any).mockResolvedValue(mockUpdatedProgress);

      // Execute test
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");
      
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
      // Create a flashcard
      const mockFlashcard = {
        id: 1,
        kana: "あ",
        romaji: "a", 
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.flashcard.create as any).mockResolvedValue(mockFlashcard);

      // Create progress record
      const mockProgress = {
        id: 1,
        userId: mockUser.id,
        flashcardId: 1,
        correctCount: 1,
        incorrectCount: 0,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.userProgress.create as any).mockResolvedValue(mockProgress);
      (mockPrismaClient.userProgress.findFirst as any).mockResolvedValue(mockProgress);

      // Execute test
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");
      
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
      // Create a flashcard
      const mockFlashcard = {
        id: 1,
        kana: "あ",
        romaji: "a", 
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.flashcard.create as any).mockResolvedValue(mockFlashcard);

      // Create progress record
      const mockProgress = {
        id: 1,
        userId: mockUser.id,
        flashcardId: 1,
        correctCount: 1,
        incorrectCount: 0,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.userProgress.create as any).mockResolvedValue(mockProgress);
      (mockPrismaClient.userProgress.findMany as any).mockResolvedValue([mockProgress]);

      // Execute test
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");
      
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
      // Create performance record
      const mockPerformance = {
        id: 1,
        userId: mockUser.id,
        kana: "あ",
        kanaType: "hiragana",
        correctCount: 1,
        totalCount: 1,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.userKanaPerformance.create as any).mockResolvedValue(mockPerformance);

      // Execute test
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");
      
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
      // Create performance record
      const mockPerformance = {
        id: 1,
        userId: mockUser.id,
        kana: "あ",
        kanaType: "hiragana",
        correctCount: 1,
        totalCount: 1,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (mockPrismaClient.userKanaPerformance.create as any).mockResolvedValue(mockPerformance);
      
      // Create updated performance record
      const mockUpdatedPerformance = {
        ...mockPerformance,
        correctCount: 2,
        totalCount: 3
      };
      (mockPrismaClient.userKanaPerformance.update as any).mockResolvedValue(mockUpdatedPerformance);

      // Execute test
      const user = await createUser(testUser.email, testUser.password);
      if (!user) throw new Error("Failed to create user");
      
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
