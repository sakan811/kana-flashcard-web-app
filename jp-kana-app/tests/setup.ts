import { expect, afterEach, afterAll, beforeEach, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { mockPrismaClient, resetPrismaMocks } from "./prisma-mock";

// Add testing-library jest-dom matchers
expect.extend(matchers);

// Mock the Prisma client for testing
vi.mock("@prisma/client", () => {
  return {
    PrismaClient: vi.fn(() => mockPrismaClient)
  };
});

// Mock the Prisma import from our lib
vi.mock("../src/lib/prisma", () => {
  return {
    default: mockPrismaClient,
    getPrismaClient: vi.fn(() => mockPrismaClient)
  };
});

// Reset all mocks between tests
beforeEach(() => {
  resetPrismaMocks();
});

// Export mock client for individual tests
export const prisma = mockPrismaClient;
