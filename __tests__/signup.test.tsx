import { render, screen, fireEvent } from "@testing-library/react";
import SignUpPage from "../app/login/signup/page";
import { describe, test, expect } from "vitest";

describe("SignUpPage", () => {
  test("renders sign up form", () => {
    render(<SignUpPage />);
    const signUpTexts = screen.getAllByText("Sign Up");
    expect(signUpTexts.length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Username")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    const signUpButtons = screen.getAllByRole("button", { name: /sign up/i });
    expect(signUpButtons.length).toBeGreaterThan(0);
  });

  test("form fields accept input", () => {
    render(<SignUpPage />);
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "newpass" } });
    expect(usernameInput.value).toBe("newuser");
    expect(passwordInput.value).toBe("newpass");
  });
});
