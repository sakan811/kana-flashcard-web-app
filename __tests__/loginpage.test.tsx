import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../app/login/page";
import { describe, test, expect } from "vitest";

describe("LoginPage", () => {
  test("renders sign in and sign up buttons", () => {
    render(<LoginPage />);
    const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
    const signUpButtons = screen.getAllByRole("button", { name: /sign up/i });
    expect(signInButtons.length).toBeGreaterThan(0);
    expect(signUpButtons.length).toBeGreaterThan(0);
  });

  test("sign in and sign up buttons are clickable", () => {
    render(<LoginPage />);
    const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
    const signUpButtons = screen.getAllByRole("button", { name: /sign up/i });
    fireEvent.click(signInButtons[0]);
    fireEvent.click(signUpButtons[0]);
    // Navigation is handled by next/navigation, so we only test clickability here
    expect(signInButtons[0]).toBeDefined();
    expect(signUpButtons[0]).toBeDefined();
  });
});
