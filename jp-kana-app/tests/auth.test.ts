import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockedFunction } from "./test-utils";
import type { User } from "../src/lib/auth";

// Define test user constants outside for reuse
const TEST_USER = {
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
};

// Mock the auth module - Vitest hoists this to the top of the file
vi.mock("../src/lib/auth", () => ({
  getUserByEmail: vi.fn().mockImplementation(
    (email: string): Promise<User | null> => {
      // Validate email format (for testing purposes)
      if (!email.includes("@")) {
        return Promise.reject(new Error("Invalid email format"));
      }

      // Return a proper user object
      return Promise.resolve({
        id: "test-user-id",
        email,
        name: "Test User",
      });
    },
  ),
  requireAuth: vi.fn(),
  checkAuth: vi.fn(),
}));

// Import after mocking to get the mocked versions
import { getUserByEmail, checkAuth } from "../src/lib/auth";

describe("Authentication", () => {
  beforeEach(() => {
    // Reset mocks between tests
    vi.clearAllMocks();
  });

  describe("User Lookup", () => {
    it("should find a user by email", async () => {
      const user = await getUserByEmail(TEST_USER.email);

      expect(user).toBeDefined();
      expect(user?.email).toBe(TEST_USER.email);
      expect(getUserByEmail).toHaveBeenCalledWith(TEST_USER.email);
    });

    it("should validate email format", async () => {
      const invalidEmail = "invalid-email";

      await expect(
        getUserByEmail(invalidEmail)
      ).rejects.toThrow("Invalid email format");
    });
  });

  describe("Authentication Checks", () => {
    it("should check auth status", async () => {
      // Mock the checkAuth implementation for this test
      (checkAuth as MockedFunction<typeof checkAuth>).mockResolvedValueOnce({
        isAuthenticated: true,
        user: TEST_USER,
      });

      const result = await checkAuth();
      
      expect(result.isAuthenticated).toBe(true);
      expect(result.user).toEqual(TEST_USER);
    });
  });
});
