import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import LoginPage from "../app/login/page";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Create mock functions
const mockSignIn = vi.mocked(signIn);
const mockUseSession = vi.mocked(useSession);
const mockUseRouter = vi.mocked(useRouter);

describe("LoginPage", () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
      push: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
    } as any);

    mockUseSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("renders Google sign in button", () => {
    render(<LoginPage />);

    expect(screen.getByText("Japanese Kana Flashcard App")).toBeDefined();
    expect(
      screen.getByRole("button", { name: /continue with google/i }),
    ).toBeDefined();
    expect(screen.getByText(/Sign in with your Google account/)).toBeDefined();
  });

  test("Google sign in button is clickable and calls signIn", () => {
    render(<LoginPage />);

    const googleButton = screen.getByRole("button", {
      name: /continue with google/i,
    });
    fireEvent.click(googleButton);

    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/" });
  });

  test("redirects authenticated users", () => {
    // Mock authenticated state
    mockUseSession.mockReturnValue({
      status: "authenticated",
      data: { user: { name: "Test User", email: "test@example.com" } },
    });

    render(<LoginPage />);

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  test("shows loading state", () => {
    // Mock loading state
    mockUseSession.mockReturnValue({
      status: "loading",
      data: null,
    });

    render(<LoginPage />);

    const spinnerElement = document.querySelector(".animate-spin");
    expect(spinnerElement).toBeTruthy();
  });
});
