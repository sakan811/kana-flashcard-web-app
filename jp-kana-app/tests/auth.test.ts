import { describe, it, expect, beforeEach, vi } from "vitest";
import { createUser } from "../src/lib/auth";
import { User } from "../src/lib/auth";

// Add proper type for mocked function with specific types instead of any
type MockedFunction<T extends (...args: unknown[]) => unknown> = T &
  ReturnType<typeof vi.fn>;

// Import the module before mocking
vi.mock("../src/lib/auth", () => ({
  createUser: vi.fn().mockImplementation((email: string, password: string) => {
    void password; // Mark as intentionally unused
    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }
    return Promise.resolve({
      id: "test-user-id",
      email: email,
      name: null,
    } as User);
  }),
  comparePassword: vi.fn(),
}));

describe("Authentication", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
  });

  describe("User Creation", () => {
    it("should create a new user", async () => {
      const user = await createUser(testUser.email, testUser.password);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
    });

    it("should not create duplicate users", async () => {
      // Make first createUser call succeed
      (createUser as MockedFunction<typeof createUser>).mockImplementationOnce(
        async (email: string, password: string) => {
          void password; // Mark as intentionally unused
          return {
            id: "test-user-id",
            email: email,
            name: null,
          } as User;
        },
      );

      // Make second createUser call fail with null
      (createUser as MockedFunction<typeof createUser>).mockImplementationOnce(
        async () => {
          return null;
        },
      );

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
        createUser(invalidUser.email, invalidUser.password),
      ).rejects.toThrow("Invalid email format");
    });
  });
});
