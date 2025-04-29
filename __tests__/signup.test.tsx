import { render, screen, fireEvent } from "@testing-library/react";
import SignUpPage from "../app/login/signup/page";
import { describe, test, expect } from "vitest";

describe("SignUpPage", () => {
  test("renders sign up form", () => {
    render(<SignUpPage />);
    expect(screen.getByText("Sign Up")).toBeDefined();
    expect(screen.getByLabelText("Username")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeDefined();
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
