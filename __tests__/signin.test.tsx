import { render, screen, fireEvent } from "@testing-library/react";
import SignInPage from "../app/login/page";
import { describe, test, expect, vi } from "vitest";
import { SessionProvider } from "next-auth/react";

// Mock next-auth/react module
vi.mock("next-auth/react", () => ({
  useSession: vi.fn().mockReturnValue({
    status: "unauthenticated",
    data: null,
  }),
  SessionProvider: ({ children }) => children,
  signIn: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockReturnValue({
    replace: vi.fn(),
  }),
}));

describe("SignInPage", () => {
  test("renders sign in form", () => {
    render(
      <SessionProvider>
        <SignInPage />
      </SessionProvider>,
    );
    const signInTexts = screen.getAllByText("Sign In");
    expect(signInTexts.length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Email")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
    expect(signInButtons.length).toBeGreaterThan(0);
  });

  test("form fields accept input", () => {
    render(
      <SessionProvider>
        <SignInPage />
      </SessionProvider>,
    );
    const usernameInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpass" } });
    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpass");
  });
});
