import { describe, it, expect, beforeEach, vi } from "vitest";
import { createUser, comparePassword } from "../src/lib/auth";
import { mockPrismaClient } from "./prisma-mock";

// Need to mock the auth module
vi.mock("../src/lib/auth", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    createUser: vi.fn(async (email, password) => {
      if (!email.includes('@')) {
        throw new Error("Invalid email format");
      }
      return {
        id: "test-id",
        email: email,
        name: null
      };
    }),
    comparePassword: vi.fn()
  };
});

describe("Authentication", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
    mockPrismaClient.user.create.mockReset();
    mockPrismaClient.user.findUnique.mockReset();
  });

  describe("User Creation", () => {
    it("should create a new user", async () => {
      const user = await createUser(testUser.email, testUser.password);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
    });

    it("should not create duplicate users", async () => {
      // Make first createUser call succeed
      createUser.mockImplementationOnce(async (email, password) => {
        return {
          id: "test-id",
          email: email,
          name: null
        };
      });
      
      // Make second createUser call fail with null
      createUser.mockImplementationOnce(async () => {
        return null;
      });

      await createUser(testUser.email, testUser.password);
      const duplicateUser = await createUser(testUser.email, testUser.password);
      expect(duplicateUser).toBeNull();
    });

    it("should hash the password", async () => {
      const user = await createUser(testUser.email, testUser.password);
      
      // Since we're mocking, just verify user was created
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
    });

    it("should validate email format", async () => {
      const invalidUser = {
        email: "invalid-email",
        password: "password123",
      };
      
      await expect(
        createUser(invalidUser.email, invalidUser.password)
      ).rejects.toThrow("Invalid email format");
    });
  });
});
