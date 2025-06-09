import { afterAll, afterEach, beforeAll, vi } from "vitest";

// Mock ResizeObserver which isn't available in test environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock next/navigation for useRouter and related hooks
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch globally
global.fetch = vi.fn();

// Mock performance.now for performance tests
global.performance = {
  ...global.performance,
  now: vi.fn(() => Date.now()),
};

// Add console.error suppression for expected errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning") ||
        args[0].includes("Error fetching") ||
        args[0].includes("Network error"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  process.env.NEXTAUTH_SECRET = 'test-secret';
  process.env.AUTH_GOOGLE_ID = 'test-google-id';
  process.env.AUTH_GOOGLE_SECRET = 'test-google-secret';
});

afterAll(() => {
  console.error = originalError;
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.clearAllMocks();
});

export const createMockSession = (overrides = {}) => ({
  user: {
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    image: 'https://example.com/avatar.jpg',
    ...overrides,
  },
  expires: '2025-12-31T23:59:59.999Z',
});

export const createMockUnauthenticatedSession = () => ({
  data: null,
  status: 'unauthenticated' as const,
});

export const createMockLoadingSession = () => ({
  data: null,
  status: 'loading' as const,
});
