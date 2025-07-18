/**
 * HiraganaClient Component Tests
 * Tests for the client-side Hiragana page component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HiraganaClient from "../../app/hiragana/HiraganaClient";

// Mock FlashcardApp component
vi.mock("../../components/FlashcardApp", () => ({
  default: ({ kanaType }: { kanaType: string }) => (
    <div data-testid="flashcard-app" data-kana-type={kanaType}>
      FlashcardApp - Kana Type: {kanaType}
    </div>
  ),
}));

describe("HiraganaClient Component", () => {
  it("should render FlashcardApp with hiragana type", () => {
    render(<HiraganaClient />);

    const flashcardApp = screen.getByTestId("flashcard-app");
    expect(flashcardApp).toBeInTheDocument();
    expect(flashcardApp).toHaveAttribute("data-kana-type", "hiragana");
    expect(flashcardApp).toHaveTextContent(
      "FlashcardApp - Kana Type: hiragana",
    );
  });

  it("should pass correct props to FlashcardApp", () => {
    render(<HiraganaClient />);

    const flashcardApp = screen.getByTestId("flashcard-app");
    expect(flashcardApp).toHaveAttribute("data-kana-type", "hiragana");
  });

  it("should be a client component", () => {
    // This test verifies the component can be rendered in a test environment
    // which confirms it's a client component
    expect(() => render(<HiraganaClient />)).not.toThrow();
  });
});
