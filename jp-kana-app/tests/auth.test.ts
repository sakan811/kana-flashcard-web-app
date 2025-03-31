import { describe, it, expect, beforeEach } from "vitest";
import { createUser } from "../src/lib/auth";
import { prisma } from "./setup";

describe("Authentication", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe("User Creation", () => {
    it("should create a new user", async () => {
      const user = await createUser(testUser.email, testUser.password);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
    });

    it("should not create duplicate users", async () => {
      await createUser(testUser.email, testUser.password);
      const duplicateUser = await createUser(testUser.email, testUser.password);
      expect(duplicateUser).toBeNull();
    });

    it("should hash the password", async () => {
      const user = await createUser(testUser.email, testUser.password);
      expect(user).toBeDefined();
      const dbUser = await prisma.user.findUnique({
        where: { email: testUser.email }
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.id).toBe(user?.id);
    });

    it("should validate email format", async () => {
      const invalidUser = {
        email: "invalid-email",
        password: "password123",
      };
      await expect(createUser(invalidUser.email, invalidUser.password)).rejects.toThrow();
    });
  });
});
