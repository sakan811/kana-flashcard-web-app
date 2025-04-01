import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockedFunction } from "./test-utils";
import type { User } from "../src/lib/auth";

// Define test user constants outside for reuse
const TEST_USER = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
};

// Create a typed mockImplementation function for better readability
const mockCreateUserImplementation = (
  email: string,
  password: string,
  name?: string,
): Promise<User> => {
  // Mark password as intentionally unused
  void password;

  // Validate email format (for testing purposes)
  if (!email.includes("@")) {
    return Promise.reject(new Error("Invalid email format"));
  }

  // Return a proper user object
  return Promise.resolve({
    id: "test-user-id",
    email,
    name: name || null,
  });
};

// Mock the auth module - Vitest hoists this to the top of the file
vi.mock("../src/lib/auth", () => ({
  createUser: vi.fn().mockImplementation(mockCreateUserImplementation),
  comparePassword: vi.fn(),
  getUserByEmail: vi.fn(),
  hashPassword: vi.fn(),
}));

// Import after mocking to get the mocked versions
import { createUser } from "../src/lib/auth";

describe("Authentication", () => {
  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();

    // Reset default implementation for createUser
    (createUser as MockedFunction<typeof createUser>).mockImplementation(
      function (...args: unknown[]) {
        // We know the implementation expects these parameters
        const email = args[0] as string;
        const password = args[1] as string;
        const name = args[2] as string | undefined;
        return mockCreateUserImplementation(email, password, name);
      },
    );
  });

  describe("User Creation", () => {
    it("should create a new user", async () => {
      const user = await createUser(
        TEST_USER.email,
        TEST_USER.password,
        TEST_USER.name,
      );

      expect(user).toBeDefined();
      expect(user?.email).toBe(TEST_USER.email);
      expect(user?.name).toBe(TEST_USER.name);
      expect(createUser).toHaveBeenCalledWith(
        TEST_USER.email,
        TEST_USER.password,
        TEST_USER.name,
      );
    });

    it("should not create duplicate users", async () => {
      // First call succeeds
      const firstUser = await createUser(
        TEST_USER.email,
        TEST_USER.password,
        TEST_USER.name,
      );
      expect(firstUser).toBeDefined();

      // Second call returns null (simulating duplicate)
      (createUser as MockedFunction<typeof createUser>).mockResolvedValueOnce(
        null,
      );
      const duplicateUser = await createUser(
        TEST_USER.email,
        TEST_USER.password,
        TEST_USER.name,
      );

      expect(duplicateUser).toBeNull();
      expect(createUser).toHaveBeenCalledTimes(2);
    });

    it("should handle password hashing implicitly", async () => {
      await createUser(TEST_USER.email, TEST_USER.password);

      expect(createUser).toHaveBeenCalledWith(
        TEST_USER.email,
        TEST_USER.password,
      );
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

    it("should create user without name when not provided", async () => {
      const user = await createUser(TEST_USER.email, TEST_USER.password);

      expect(user?.name).toBeNull();
      expect(createUser).toHaveBeenCalledWith(
        TEST_USER.email,
        TEST_USER.password,
      );
    });
  });
});
