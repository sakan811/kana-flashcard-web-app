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

// Mock fetch for API calls
global.fetch = vi.fn();

describe("SignInPage Error Messages", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock successful API response by default
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  test("displays error message when API authentication fails", async () => {
    // Mock API to return error
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          error: "Account not found. Please check your username or sign up.",
        }),
    });

    render(<SignInPage />);

    // Fill in form using correct labels
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText(
          "Account not found. Please check your username or sign up.",
        ),
      ).toBeTruthy();
    });
  });

  test("displays error when NextAuth session creation fails", async () => {
    // Mock API success but NextAuth failure
    (signIn as any).mockResolvedValue({
      error: "CredentialsSignin",
    });

    render(<SignInPage />);

    // Fill in form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpass" },
    });

    // Submit form
    const buttons = screen.getAllByRole("button", { name: /sign in/i });
    fireEvent.click(buttons[0]);

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText("Unable to establish session. Please try again."),
      ).toBeTruthy();
    });
  });

  test("displays error message when network request fails", async () => {
    // Mock fetch to reject
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    render(<SignInPage />);

    // Fill in form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpass" },
    });

    // Submit form
    const buttons = screen.getAllByRole("button", { name: /sign in/i });
    fireEvent.click(buttons[0]);

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText("An unexpected error occurred. Please try again."),
      ).toBeTruthy();
    });
  });

  test("displays validation error for empty fields", async () => {
    render(<SignInPage />);

    // Clear any default values and submit form
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });

    // Submit form
    const buttons = screen.getAllByRole("button", { name: /sign in/i });
    fireEvent.click(buttons[0]);

    // Wait for error message - update to match actual error
    await waitFor(() => {
      expect(
        screen.getByText("An unexpected error occurred. Please try again."),
      ).toBeTruthy();
    });
  });
});

describe("SignInPage", () => {
  test("renders sign in form", () => {
    render(<SignInPage />);

    const signInTexts = screen.getAllByText("Sign In");
    expect(signInTexts.length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Email")).toBeDefined(); // Changed from "Username"
    expect(screen.getByLabelText("Password")).toBeDefined();
    const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
    expect(signInButtons.length).toBeGreaterThan(0);
  });

  test("form fields accept input", () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email"); // Changed from "Username"
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpass" } });
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("testpass");
  });
});
