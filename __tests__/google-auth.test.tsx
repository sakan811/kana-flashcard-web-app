import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginPage from "../app/login/page";

const mockSignIn = vi.mocked(signIn);
const mockUseSession = vi.mocked(useSession);
const mockUseRouter = vi.mocked(useRouter);

describe("Google OAuth Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRouter.mockReturnValue({
      replace: vi.fn(),
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

  test("initiates Google sign-in when button clicked", () => {
    render(<LoginPage />);

    const googleButton = screen.getByRole("button", {
      name: /continue with google/i,
    });
    fireEvent.click(googleButton);

    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/" });
  });

  test("displays Google sign-in interface", () => {
    render(<LoginPage />);

    // Use getAllBy* methods to handle multiple elements gracefully
    const googleButtons = screen.getAllByText("Continue with Google");
    expect(googleButtons.length).toBeGreaterThan(0);

    expect(screen.getByText(/Sign in with your Google account/)).toBeTruthy();

    // Check for Google logo SVG
    const googleSvg = document.querySelector("svg");
    expect(googleSvg).toBeTruthy();
  });
});
