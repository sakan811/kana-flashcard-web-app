import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Flashcard from "../components/Flashcard";
import { useFlashcard } from "../components/FlashcardProvider";
import { mockFlashcardProvider, mockKana } from "./utils/test-helpers";

vi.mock("../components/FlashcardProvider", () => ({
  useFlashcard: vi.fn(),
}));

describe("Flashcard Component", () => {
  beforeEach(() => {
    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({
        interactionMode: "typing",
        choices: ["a", "ka", "sa", "ta"]
      })
    );
  });

  test("shows loading state", () => {
    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({ 
        loadingKana: true,
        interactionMode: "typing",
        choices: ["a", "ka", "sa", "ta"]
      }),
    );
    render(<Flashcard />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  test("shows empty state when no cards", () => {
    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({
        interactionMode: "typing",
        choices: ["a", "ka", "sa", "ta"]
      })
    );
    render(<Flashcard />);
    expect(screen.getByText("No flashcards available.")).toBeDefined();
  });

  test("renders flashcard and handles submission", async () => {
    const submitAnswer = vi.fn();
    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({ 
        currentKana: mockKana.basic, 
        submitAnswer,
        interactionMode: "typing",
        choices: ["a", "ka", "sa", "ta"]
      }),
    );

    render(<Flashcard />);

    expect(screen.getByText("あ")).toBeDefined();

    const input = screen.getByPlaceholderText("Type romaji equivalent...");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.click(submitButton);

    expect(submitAnswer).toHaveBeenCalledWith("a");
  });

  test("shows results and handles next card", () => {
    const nextCard = vi.fn();
    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({
        currentKana: mockKana.basic,
        result: "correct",
        nextCard,
        interactionMode: "typing",
        choices: ["a", "ka", "sa", "ta"]
      }),
    );

    render(<Flashcard />);

    expect(screen.getByText("Correct!")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Next Card" }));
    expect(nextCard).toHaveBeenCalled();
  });

  test("validates empty input", () => {
    (useFlashcard as any).mockReturnValue(
      mockFlashcardProvider({ 
        currentKana: mockKana.basic,
        interactionMode: "typing",
        choices: ["a", "ka", "sa", "ta"]
      }),
    );

    render(<Flashcard />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText("Please enter an answer")).toBeDefined();
  });
});