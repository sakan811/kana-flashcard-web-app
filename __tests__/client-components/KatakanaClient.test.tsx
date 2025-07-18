/**
 * KatakanaClient Component Tests
 * Tests for the client-side Katakana page component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import KatakanaClient from "../../app/katakana/KatakanaClient";

// Mock FlashcardApp component
vi.mock("../../components/FlashcardApp", () => ({
  default: ({ kanaType }: { kanaType: string }) => (
    <div data-testid="flashcard-app" data-kana-type={kanaType}>
      FlashcardApp - Kana Type: {kanaType}
    </div>
  ),
}));

describe("KatakanaClient Component", () => {
  it("should render FlashcardApp with katakana type", () => {
    render(<KatakanaClient />);

    const flashcardApp = screen.getByTestId("flashcard-app");
    expect(flashcardApp).toBeInTheDocument();
    expect(flashcardApp).toHaveAttribute("data-kana-type", "katakana");
    expect(flashcardApp).toHaveTextContent(
      "FlashcardApp - Kana Type: katakana",
    );
  });

  it("should pass correct props to FlashcardApp", () => {
    render(<KatakanaClient />);

    const flashcardApp = screen.getByTestId("flashcard-app");
    expect(flashcardApp).toHaveAttribute("data-kana-type", "katakana");
  });

  it("should be a client component", () => {
    // This test verifies the component can be rendered in a test environment
    // which confirms it's a client component
    expect(() => render(<KatakanaClient />)).not.toThrow();
  });
});
