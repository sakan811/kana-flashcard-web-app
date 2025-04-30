import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInPage from "../app/login/signin/page";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { signIn } from "next-auth/react";

// Mock next-auth/react module
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    status: "unauthenticated",
    data: null,
  })),
  SessionProvider: ({ children }) => children,
  signIn: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockReturnValue({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

describe("SignInPage Error Messages", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset fetch mock between tests
    if (global.fetch) {
      vi.restoreAllMocks();
    }
  });
  test("displays error message when authentication fails", async () => {
    // Mock the fetch function to simulate API call
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid password" }),
    });

    render(<SignInPage />);

    // Fill in form
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    // Submit form
    const signInButton = screen.getAllByRole("button", { name: /sign in/i })[0];
    fireEvent.click(signInButton);

    // Wait for async operations and check for error message
    await waitFor(() => {
      expect(screen.getByText("Invalid password")).toBeTruthy();
    });
  });
  test("displays generic error message for other authentication errors", async () => {
    // Mock the fetch function to simulate API call with a different error
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Database connection error" }),
    });

    render(<SignInPage />);

    // Fill in form
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpass" },
    });

    // Submit form
    const signInButton = screen.getAllByRole("button", { name: /sign in/i })[0];
    fireEvent.click(signInButton);

    // Wait for async operations and check for error message
    await waitFor(() => {
      expect(screen.getByText("Database connection error")).toBeTruthy();
    });
  });
  test("displays error message when exception occurs", async () => {
    // Mock fetch to throw an exception
    global.fetch = vi.fn().mockImplementation(() => {
      throw new Error("Network error");
    });

    render(<SignInPage />);

    // Fill in form
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpass" },
    });

    // Submit form
    const signInButton = screen.getAllByRole("button", { name: /sign in/i })[0];
    fireEvent.click(signInButton);

    // Wait for async operations and check for error message
    await waitFor(() => {
      expect(screen.getByText("Sign in failed: Network error")).toBeTruthy();
    });
  });
});
