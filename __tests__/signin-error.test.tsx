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
  });

  test("displays error message when authentication fails", async () => {
    // Mock signIn to return failure with error
    (signIn as any).mockResolvedValue({
      ok: false,
      error: "CredentialsSignin",
    });
    
    render(<SignInPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpass" } });
    
    // Submit form
    const signInButton = screen.getAllByRole("button", { name: /sign in/i })[0];
    fireEvent.click(signInButton);
    
    // Wait for async operations and check for error message
    await waitFor(() => {
      expect(screen.getByText("Invalid username or password")).toBeTruthy();
    });
  });

  test("displays generic error message for other authentication errors", async () => {
    // Mock signIn to return failure with different error
    (signIn as any).mockResolvedValue({
      ok: false,
      error: "SomeOtherError",
    });
    
    render(<SignInPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "testpass" } });
    
    // Submit form
    const signInButton = screen.getAllByRole("button", { name: /sign in/i })[0];
    fireEvent.click(signInButton);
    
    // Wait for async operations and check for error message
    await waitFor(() => {
      expect(screen.getByText("SomeOtherError")).toBeTruthy();
    });
  });

  test("displays error message when exception occurs", async () => {
    // Mock signIn to throw an exception
    (signIn as any).mockRejectedValue(new Error("Sign-in failed"));
    
    render(<SignInPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "testpass" } });
    
    // Submit form
    const signInButton = screen.getAllByRole("button", { name: /sign in/i })[0];
    fireEvent.click(signInButton);
    
    // Wait for async operations and check for error message
    await waitFor(() => {
      expect(screen.getByText("Sign in failed")).toBeTruthy();
    });
  });
});
