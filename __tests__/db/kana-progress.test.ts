import { describe, test, expect } from "vitest";
import { getTestPrisma } from "./setup";

describe("KanaProgress Database Operations", () => {
  test("should create new progress record", async () => {
    const prisma = await getTestPrisma();

    const progress = await prisma.kanaProgress.create({
      data: {
        kana_id: "test-1",
        user_id: "test-user-1",
        attempts: 1,
        correct_attempts: 1,
        accuracy: 1.0,
      },
    });

    expect(progress.id).toBeDefined();
    expect(progress.accuracy).toBe(1.0);
    expect(progress.attempts).toBe(1);
  });

  test("should update existing progress with upsert", async () => {
    const prisma = await getTestPrisma();

    // Create initial record
    await prisma.kanaProgress.create({
      data: {
        kana_id: "test-1",
        user_id: "test-user-1",
        attempts: 1,
        correct_attempts: 1,
        accuracy: 1.0,
      },
    });

    // Wait a bit to avoid SQLite timing issues
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Update with upsert
    const updated = await prisma.kanaProgress.upsert({
      where: {
        kana_id_user_id: {
          kana_id: "test-1",
          user_id: "test-user-1",
        },
      },
      update: {
        attempts: { increment: 1 },
        correct_attempts: { increment: 1 },
        accuracy: 1.0,
      },
      create: {
        kana_id: "test-1",
        user_id: "test-user-1",
        attempts: 1,
        correct_attempts: 1,
        accuracy: 1.0,
      },
    });

    expect(updated.attempts).toBe(2);
    expect(updated.correct_attempts).toBe(2);
  });

  test("should handle accuracy calculation correctly", async () => {
    const prisma = await getTestPrisma();

    const progress = await prisma.kanaProgress.create({
      data: {
        kana_id: "test-2",
        user_id: "test-user-1",
        attempts: 10,
        correct_attempts: 7,
        accuracy: 0.7,
      },
    });

    expect(progress.accuracy).toBe(0.7);
    expect(progress.attempts).toBe(10);
    expect(progress.correct_attempts).toBe(7);
  });

  test("should maintain unique constraint on kana_id + user_id", async () => {
    const prisma = await getTestPrisma();

    await prisma.kanaProgress.create({
      data: {
        kana_id: "test-3",
        user_id: "test-user-1",
        attempts: 1,
        correct_attempts: 1,
        accuracy: 1.0,
      },
    });

    // Attempting to create duplicate should fail
    await expect(
      prisma.kanaProgress.create({
        data: {
          kana_id: "test-3",
          user_id: "test-user-1",
          attempts: 2,
          correct_attempts: 1,
          accuracy: 0.5,
        },
      }),
    ).rejects.toThrow();
  });
});
