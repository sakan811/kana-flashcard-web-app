import { render, screen, fireEvent } from "@testing-library/react";
import SignInPage from "../app/login/signin/page";
import { describe, test, expect } from "vitest";

describe("SignInPage", () => {
  test("renders sign in form", () => {
    render(<SignInPage />);
    expect(screen.getByText("Sign In")).toBeDefined();
    expect(screen.getByLabelText("Username")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDefined();
  });

  test("form fields accept input", () => {
    render(<SignInPage />);
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpass" } });
    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpass");
  });
});
