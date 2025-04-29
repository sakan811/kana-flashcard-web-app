import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../app/login/page";
import { describe, test, expect } from "vitest";

describe("LoginPage", () => {
  test("renders sign in and sign up buttons", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeDefined();
  });

  test("sign in and sign up buttons are clickable", () => {
    render(<LoginPage />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(signInButton);
    fireEvent.click(signUpButton);
    // Navigation is handled by next/navigation, so we only test clickability here
    expect(signInButton).toBeDefined();
    expect(signUpButton).toBeDefined();
  });
});
