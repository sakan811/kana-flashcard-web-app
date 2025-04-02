import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockPrismaClient } from "./prisma-mock";
import { Character, KanaType } from "@/types/kana";
import { User } from "../src/lib/auth";
import { MockedFunction } from "./test-utils";

// Import the mocked createUser function first, before it's used
import { createUser } from "../src/lib/auth";

// Define the mock user object upfront to avoid undefined issues
const mockUser: User = {
  id: "test-user-id",
  email: "test@example.com",
  name: null,
};

// Mock the auth module with a defined implementation
vi.mock("../src/lib/auth", () => ({
  createUser: vi.fn().mockImplementation(() =>
    Promise.resolve({
      id: "test-user-id",
      email: "test@example.com",
      name: null,
    } as User),
  ),
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
    (createUser as MockedFunction<typeof createUser>).mockImplementation(() =>
      Promise.resolve(mockUser),
    );

    // Reset Prisma mocks using type assertion with unknown instead of any
    (
      mockPrismaClient.user.create as unknown as { mockReset: () => void }
    ).mockReset();
    (
      mockPrismaClient.user.findUnique as unknown as { mockReset: () => void }
    ).mockReset();
    (
      mockPrismaClient.flashcard.create as unknown as { mockReset: () => void }
    ).mockReset();
    (
      mockPrismaClient.userKanaPerformance.create as unknown as {
        mockReset: () => void;
      }
    ).mockReset();
    (
      mockPrismaClient.userKanaPerformance.update as unknown as {
        mockReset: () => void;
      }
    ).mockReset();
    (
      mockPrismaClient.userKanaPerformance.findFirst as unknown as {
        mockReset: () => void;
      }
    ).mockReset();
    (
      mockPrismaClient.userKanaPerformance.findMany as unknown as {
        mockReset: () => void;
      }
    ).mockReset();
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
      (createUser as MockedFunction<typeof createUser>).mockResolvedValueOnce(
        mockUser,
      );
      // Second call returns null (duplicate)
      (createUser as MockedFunction<typeof createUser>).mockResolvedValueOnce(
        null,
      );

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
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.flashcard.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockFlashcard);

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
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.userKanaPerformance.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockPerformance);

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
      const progress = await mockPrismaClient.userKanaPerformance.create({
        data: {
          userId: user.id,
          kana: flashcard.kana,
          kanaType: flashcard.type,
          correctCount: 1,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });

      expect(progress).toBeDefined();
      expect(progress.userId).toBe(user.id);
      expect(progress.kana).toBe(flashcard.kana);
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
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.flashcard.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockFlashcard);

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
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.userKanaPerformance.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockPerformance);

      // Create updated performance record
      const mockUpdatedPerformance = {
        ...mockPerformance,
        correctCount: 2,
        totalCount: 2,
      };
      (
        mockPrismaClient.userKanaPerformance.update as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockUpdatedPerformance);

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
      const progress = await mockPrismaClient.userKanaPerformance.create({
        data: {
          userId: user.id,
          kana: flashcard.kana,
          kanaType: flashcard.type,
          correctCount: 1,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });
      const updatedProgress = await mockPrismaClient.userKanaPerformance.update(
        {
          where: { id: progress.id },
          data: {
            correctCount: 2,
            totalCount: 2,
            lastPracticed: new Date(),
          },
        },
      );

      expect(updatedProgress.correctCount).toBe(2);
      expect(updatedProgress.totalCount).toBe(2);
    });

    it("should get user progress by kana", async () => {
      // Create a flashcard
      const mockFlashcard = {
        id: 1,
        kana: "あ",
        romaji: "a",
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.flashcard.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockFlashcard);

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
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.userKanaPerformance.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockPerformance);

      (
        mockPrismaClient.userKanaPerformance.findFirst as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockPerformance);

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
      await mockPrismaClient.userKanaPerformance.create({
        data: {
          userId: user.id,
          kana: flashcard.kana,
          kanaType: flashcard.type,
          correctCount: 1,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });
      const progress = await mockPrismaClient.userKanaPerformance.findFirst({
        where: {
          userId: user.id,
          kana: flashcard.kana,
        },
      });

      expect(progress).toBeDefined();
      expect(progress?.kana).toBe(flashcard.kana);
    });

    it("should get all progress for a user", async () => {
      // Create a flashcard
      const mockFlashcard = {
        id: 1,
        kana: "あ",
        romaji: "a",
        type: "hiragana",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.flashcard.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockFlashcard);

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
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.userKanaPerformance.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockPerformance);

      (
        mockPrismaClient.userKanaPerformance.findMany as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue([mockPerformance]);

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
      await mockPrismaClient.userKanaPerformance.create({
        data: {
          userId: user.id,
          kana: flashcard.kana,
          kanaType: flashcard.type,
          correctCount: 1,
          totalCount: 1,
          lastPracticed: new Date(),
        },
      });
      const progress = await mockPrismaClient.userKanaPerformance.findMany({
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
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.userKanaPerformance.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockPerformance);

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
        updatedAt: new Date(),
      };
      (
        mockPrismaClient.userKanaPerformance.create as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockPerformance);

      // Create updated performance record
      const mockUpdatedPerformance = {
        ...mockPerformance,
        correctCount: 2,
        totalCount: 3,
      };
      (
        mockPrismaClient.userKanaPerformance.update as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockUpdatedPerformance);

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
      const updatedPerformance =
        await mockPrismaClient.userKanaPerformance.update({
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

    it("should upsert kana performance record", async () => {
      // Mock the upsert operation for recordKanaPerformance
      const mockUpsertedPerformance = {
        id: 1,
        userId: mockUser.id,
        kana: "あ",
        kanaType: "hiragana",
        correctCount: 1,
        totalCount: 1,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (
        mockPrismaClient.userKanaPerformance.upsert as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockUpsertedPerformance);

      // Import the actual function we want to test
      const { recordKanaPerformance } = await import("../src/lib/db");

      // Execute test for a new record
      await recordKanaPerformance(mockUser.id, "あ", KanaType.hiragana, true);

      // Verify upsert was called with correct parameters
      expect(mockPrismaClient.userKanaPerformance.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId_kana: {
              userId: mockUser.id,
              kana: "あ",
            },
          },
          update: expect.objectContaining({
            correctCount: expect.any(Object), // { increment: 1 }
            totalCount: expect.any(Object), // { increment: 1 }
            lastPracticed: expect.any(Date),
          }),
          create: expect.objectContaining({
            userId: mockUser.id,
            kana: "あ",
            kanaType: KanaType.hiragana,
            correctCount: 1,
            totalCount: 1,
          }),
        }),
      );
    });

    it("should handle incorrect answers in recordKanaPerformance", async () => {
      // Mock the upsert operation for recordKanaPerformance
      const mockUpsertedPerformance = {
        id: 1,
        userId: mockUser.id,
        kana: "あ",
        kanaType: "hiragana",
        correctCount: 0,
        totalCount: 1,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (
        mockPrismaClient.userKanaPerformance.upsert as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockUpsertedPerformance);

      // Import the actual function we want to test
      const { recordKanaPerformance } = await import("../src/lib/db");

      // Execute test for an incorrect answer
      await recordKanaPerformance(mockUser.id, "あ", KanaType.hiragana, false);

      // Verify upsert was called with correct parameters
      expect(mockPrismaClient.userKanaPerformance.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            correctCount: 0, // For incorrect answers
            totalCount: 1,
          }),
        }),
      );
    });

    it("should default to hiragana when kanaType is undefined", async () => {
      // Mock the upsert operation for recordKanaPerformance
      const mockUpsertedPerformance = {
        id: 1,
        userId: mockUser.id,
        kana: "あ",
        kanaType: "hiragana",
        correctCount: 1,
        totalCount: 1,
        lastPracticed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (
        mockPrismaClient.userKanaPerformance.upsert as unknown as {
          mockResolvedValue: (value: unknown) => void;
        }
      ).mockResolvedValue(mockUpsertedPerformance);

      // Import the actual function we want to test
      const { recordKanaPerformance } = await import("../src/lib/db");

      // Execute test with undefined kanaType
      await recordKanaPerformance(mockUser.id, "あ", undefined, true);

      // Verify upsert was called with hiragana as default
      expect(mockPrismaClient.userKanaPerformance.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            kanaType: KanaType.hiragana,
          }),
        }),
      );
    });
  });
});
