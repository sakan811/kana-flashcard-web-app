import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HiraganaPage from "../app/hiragana/page";

// Mock FlashcardApp component
vi.mock("@/components/FlashcardApp", () => ({
  default: ({ kanaType }: { kanaType?: string }) => (
    <div data-testid="flashcard-app" data-kana-type={kanaType}>
      FlashcardApp Component
    </div>
  ),
}));

describe("Hiragana Page", () => {
  test("renders FlashcardApp with hiragana kanaType", () => {
    render(<HiraganaPage />);
    
    const flashcardApp = screen.getByTestId("flashcard-app");
    expect(flashcardApp).toBeInTheDocument();
    expect(flashcardApp).toHaveAttribute("data-kana-type", "hiragana");
  });

  test("displays FlashcardApp content", () => {
    render(<HiraganaPage />);
    
    expect(screen.getByText("FlashcardApp Component")).toBeInTheDocument();
  });

  test("is a client component", () => {
    // Test that the component can be rendered (client components can be tested this way)
    expect(() => render(<HiraganaPage />)).not.toThrow();
  });
});