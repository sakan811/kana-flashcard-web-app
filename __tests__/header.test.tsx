import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../components/Header";

vi.mock("next/link", () => {
  return {
    default: ({ children, href }) => <a href={href}>{children}</a>,
  };
});

describe("Header", () => {
  it("renders navigation links", () => {
    render(<Header activeTab="flashcards" setActiveTab={() => {}} />);
    expect(screen.getByText("Hiragana")).toBeDefined();
    expect(screen.getByText("Katakana")).toBeDefined();
    expect(screen.getByText("Dashboard")).toBeDefined();
  });
});
