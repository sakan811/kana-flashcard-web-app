import { render, screen, fireEvent } from "@testing-library/react";
import SignUpPage from "../app/login/signup/page";
import { describe, test, expect, vi } from "vitest";
import { SessionProvider } from "next-auth/react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockReturnValue({
    replace: vi.fn(),
  }),
}));

describe("SignUpPage", () => {
  test("renders sign up form", () => {
    render(
      <SessionProvider>
        <SignUpPage />
      </SessionProvider>,
    );
    const signUpTexts = screen.getAllByText("Sign Up");
    expect(signUpTexts.length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Username")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    const signUpButtons = screen.getAllByRole("button", { name: /sign up/i });
    expect(signUpButtons.length).toBeGreaterThan(0);
  });

  test("form fields accept input", () => {
    render(
      <SessionProvider>
        <SignUpPage />
      </SessionProvider>,
    );
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "newpass" } });
    expect(usernameInput.value).toBe("newuser");
    expect(passwordInput.value).toBe("newpass");
  });
});
