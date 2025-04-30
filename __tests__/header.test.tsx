import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../components/Header";
import { signOut } from "next-auth/react";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { name: "Test User" } } }),
  signOut: vi.fn(),
}));

vi.mock("next/link", () => {
  return {
    default: ({ children, href }) => <a href={href}>{children}</a>,
  };
});

describe("Header", () => {
  it("renders navigation links", () => {
    render(
      <Header activeTab="flashcards" setActiveTab={() => {}} />
    );
    expect(screen.getByText("Hiragana")).toBeDefined();
    expect(screen.getByText("Katakana")).toBeDefined();
    expect(screen.getByText("Dashboard")).toBeDefined();
  });  it("calls signOut on button click", () => {
    render(
      <Header activeTab="dashboard" setActiveTab={() => {}} />
    );
    const buttons = screen.getAllByTestId("header-sign-out-button");
    fireEvent.click(buttons[0]);
    expect(signOut).toHaveBeenCalled();
  });
});
