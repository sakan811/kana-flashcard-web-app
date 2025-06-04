import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Flashcard from "../components/Flashcard";
import { useFlashcard } from "../components/FlashcardProvider";
import { mockFlashcardProvider, mockKana } from "./utils/test-helpers";

vi.mock("../components/FlashcardProvider", () => ({
  useFlashcard: vi.fn(),
}));

describe("Edge Cases", () => {
  test("handles whitespace-only input", () => {
    const submitAnswer = vi.fn();
    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({ currentKana: mockKana.basic, submitAnswer }),
    );

    render(<Flashcard />);

    fireEvent.change(screen.getByPlaceholderText("Type romaji equivalent..."), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Please enter an answer")).toBeDefined();
    expect(submitAnswer).not.toHaveBeenCalled();
  });

  test("handles corrupted data", () => {
    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({
        currentKana: { ...mockKana.basic, character: null },
      }),
    );

    expect(() => render(<Flashcard />)).not.toThrow();
  });

  test("cleans up on unmount", () => {
    const removeListener = vi.spyOn(window, "removeEventListener");

    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({
        currentKana: mockKana.basic,
        result: "correct",
      }),
    );

    const { unmount } = render(<Flashcard />);
    unmount();

    expect(removeListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
  });
});
