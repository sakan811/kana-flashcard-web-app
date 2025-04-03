import { expect, beforeEach, afterEach, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { mockPrismaClient, resetPrismaMocks } from "./prisma-mock";
import { cleanup } from '@testing-library/react';

// Add testing-library jest-dom matchers
expect.extend(matchers);

// Mock the Prisma client for testing
vi.mock("@prisma/client", () => {
  return {
    PrismaClient: vi.fn(() => mockPrismaClient),
  };
});

// Mock the Prisma import from our lib
vi.mock("../src/lib/prisma", () => {
  return {
    default: mockPrismaClient,
    getPrismaClient: vi.fn(() => mockPrismaClient),
  };
});

// Mock next/navigation to prevent errors in component tests
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
  usePathname: () => "/",
}));

// Mock next-auth hooks
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: { user: { id: "test-user" } },
    status: "authenticated",
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Reset all mocks between tests
beforeEach(() => {
  resetPrismaMocks();
});

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock fetch for testing
global.fetch = vi.fn();

// Mock environment variables
process.env = {
  ...process.env,
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'test-secret',
};

// Export mock client for individual tests
export const prisma = mockPrismaClient;
