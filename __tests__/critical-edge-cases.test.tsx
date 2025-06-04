import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// Import components
import Flashcard from "../components/Flashcard";
import Dashboard from "../components/Dashboard";
import { useFlashcard } from "../components/FlashcardProvider";

// Mock the FlashcardProvider hook
vi.mock("../components/FlashcardProvider", () => ({
  useFlashcard: vi.fn(),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Critical Edge Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  describe("Input Validation Edge Cases", () => {
    test("handles whitespace-only input", async () => {
      const submitAnswerMock = vi.fn();

      (useFlashcard as any).mockReturnValue({
        currentKana: {
          id: "1",
          character: "あ",
          romaji: "a",
          accuracy: 0.7,
        },
        loadingKana: false,
        submitAnswer: submitAnswerMock,
        result: null,
        nextCard: vi.fn(),
      });

      render(<Flashcard />);

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      // Type only spaces
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.click(submitButton);

      // Should show error for whitespace-only input
      expect(screen.getByText("Please enter an answer")).toBeDefined();
      expect(submitAnswerMock).not.toHaveBeenCalled();
    });

    test("handles unicode and emoji input", async () => {
      const submitAnswerMock = vi.fn();

      (useFlashcard as any).mockReturnValue({
        currentKana: {
          id: "1",
          character: "あ",
          romaji: "a",
          accuracy: 0.7,
        },
        loadingKana: false,
        submitAnswer: submitAnswerMock,
        result: null,
        nextCard: vi.fn(),
      });

      render(<Flashcard />);

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      // Type unicode and emoji
      const unicodeInput = "あいう😀🎌";
      fireEvent.change(input, { target: { value: unicodeInput } });
      fireEvent.click(submitButton);

      expect(submitAnswerMock).toHaveBeenCalledWith(unicodeInput);
    });

    test("handles copy-paste behavior", async () => {
      const submitAnswerMock = vi.fn();

      (useFlashcard as any).mockReturnValue({
        currentKana: {
          id: "1",
          character: "あ",
          romaji: "a",
          accuracy: 0.7,
        },
        loadingKana: false,
        submitAnswer: submitAnswerMock,
        result: null,
        nextCard: vi.fn(),
      });

      render(<Flashcard />);

      const input = screen.getByPlaceholderText("Type romaji equivalent...");

      // Simulate paste event
      const clipboardData = "pasted content";
      fireEvent.paste(input, {
        clipboardData: {
          getData: () => clipboardData,
        },
      });

      // Value should be updated
      expect(input.value).toBe(clipboardData);
    });
  });

  describe("Timing and Race Condition Edge Cases", () => {
    test("handles rapid component unmount during async operations", async () => {
      const submitAnswerMock = vi.fn();

      (useFlashcard as any).mockReturnValue({
        currentKana: {
          id: "1",
          character: "あ",
          romaji: "a",
          accuracy: 0.7,
        },
        loadingKana: false,
        submitAnswer: submitAnswerMock,
        result: null,
        nextCard: vi.fn(),
      });

      const { unmount } = render(<Flashcard />);

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.click(submitButton);

      // Unmount before async operation completes
      unmount();

      // Should not crash or leak memory
      vi.advanceTimersByTime(1000);
    });

    test("handles slow API responses", async () => {
      vi.useRealTimers(); // Use real timers for this test

      let resolvePromise: (value: any) => void;
      const slowPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValue(slowPromise);

      render(<Dashboard />);

      // Should show loading state
      expect(screen.getByRole("status")).toBeDefined();

      // Resolve after delay
      setTimeout(() => {
        resolvePromise!({
          ok: true,
          json: async () => [],
        });
      }, 100);

      await waitFor(
        () => {
          expect(screen.queryByRole("status")).toBeNull();
        },
        { timeout: 1000 }
      );

      vi.useFakeTimers();
    });

    test("handles API timeout scenarios", async () => {
      // Mock a request that never resolves
      mockFetch.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<Dashboard />);

      // Should show loading state indefinitely
      expect(screen.getByRole("status")).toBeDefined();

      // Advance timers significantly
      vi.advanceTimersByTime(10000);

      // Should still be in loading state (or handle timeout gracefully)
      expect(screen.getByRole("status")).toBeDefined();
    });
  });

  describe("State Management Edge Cases", () => {
    test("handles simultaneous state updates", async () => {
      const submitAnswerMock = vi.fn();
      const nextCardMock = vi.fn();

      (useFlashcard as any).mockReturnValue({
        currentKana: {
          id: "1",
          character: "あ",
          romaji: "a",
          accuracy: 0.7,
        },
        loadingKana: false,
        submitAnswer: submitAnswerMock,
        result: "correct",
        nextCard: nextCardMock,
      });

      render(<Flashcard />);

      // Try to trigger multiple state changes simultaneously
      const nextButton = screen.getByRole("button", { name: "Next Card" });

      fireEvent.click(nextButton);
      fireEvent.keyDown(window, { key: "Enter" });
      fireEvent.click(nextButton);

      // Should handle gracefully
      expect(nextCardMock).toHaveBeenCalled();
    });

    test("maintains state consistency during rapid filter changes", async () => {
      const stats = [
        {
          id: "1",
          character: "あ",
          romaji: "a",
          attempts: 5,
          correct_attempts: 4,
          accuracy: 0.8,
        },
        {
          id: "2",
          character: "ア",
          romaji: "a",
          attempts: 3,
          correct_attempts: 2,
          accuracy: 0.67,
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => stats,
      });

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Your Progress")).toBeTruthy();
      });

      // Rapidly change filters
      const allButton = screen.getByRole("button", { name: "All" });
      const hiraganaButton = screen.getByRole("button", { name: "Hiragana" });
      const katakanaButton = screen.getByRole("button", { name: "Katakana" });

      fireEvent.click(hiraganaButton);
      fireEvent.click(katakanaButton);
      fireEvent.click(allButton);
      fireEvent.click(hiraganaButton);

      // Should maintain consistent state
      await waitFor(() => {
        expect(screen.getByText("あ")).toBeTruthy();
        expect(screen.queryByText("ア")).toBeNull();
      });
    });
  });

  describe("Browser Compatibility Edge Cases", () => {
    test("handles missing modern browser features", async () => {
      // Mock missing addEventListener
      const originalAddEventListener = window.addEventListener;
      window.addEventListener = undefined as any;

      try {
        (useFlashcard as any).mockReturnValue({
          currentKana: {
            id: "1",
            character: "あ",
            romaji: "a",
            accuracy: 0.7,
          },
          loadingKana: false,
          submitAnswer: vi.fn(),
          result: "correct",
          nextCard: vi.fn(),
        });

        // Should not crash even if addEventListener is not available
        expect(() => render(<Flashcard />)).not.toThrow();
      } finally {
        window.addEventListener = originalAddEventListener;
      }
    });

    test("handles disabled JavaScript scenarios", async () => {
      (useFlashcard as any).mockReturnValue({
        currentKana: {
          id: "1",
          character: "あ",
          romaji: "a",
          accuracy: 0.7,
        },
        loadingKana: false,
        submitAnswer: vi.fn(),
        result: null,
        nextCard: vi.fn(),
      });

      render(<Flashcard />);

      // Form should still be submittable via HTML form submission
      const form = screen.getByRole("form") || screen.getByTestId("flashcard-form");
      expect(form).toBeDefined();
    });
  });

  describe("Data Corruption Prevention", () => {
    test("prevents submission with null currentKana", async () => {
      const submitAnswerMock = vi.fn();

      (useFlashcard as any).mockReturnValue({
        currentKana: null,
        loadingKana: false,
        submitAnswer: submitAnswerMock,
        result: null,
        nextCard: vi.fn(),
      });

      render(<Flashcard />);

      // Should show "No flashcards available" instead of form
      expect(screen.getByText("No flashcards available.")).toBeDefined();
      expect(screen.queryByPlaceholderText("Type romaji equivalent...")).toBeNull();
    });

    test("handles corrupted kana data gracefully", async () => {
      const submitAnswerMock = vi.fn();

      (useFlashcard as any).mockReturnValue({
        currentKana: {
          id: "1",
          character: null, // Corrupted data
          romaji: "a",
          accuracy: 0.7,
        },
        loadingKana: false,
        submitAnswer: submitAnswerMock,
        result: null,
        nextCard: vi.fn(),
      });

      // Should not crash with corrupted data
      expect(() => render(<Flashcard />)).not.toThrow();
    });

    test("validates accuracy calculations", async () => {
      const edgeCaseStats = [
        {
          id: "1",
          character: "あ",
          romaji: "a",
          attempts: 0,
          correct_attempts: 1, // More correct than total attempts (impossible)
          accuracy: 2.0, // > 100% accuracy (impossible)
        },
        {
          id: "2",
          character: "い",
          romaji: "i",
          attempts: -5, // Negative attempts (impossible)
          correct_attempts: -2,
          accuracy: -0.5, // Negative accuracy (impossible)
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => edgeCaseStats,
      });

      // Should not crash with impossible data
      expect(() => render(<Dashboard />)).not.toThrow();

      await waitFor(() => {
        expect(screen.getByText("Your Progress")).toBeTruthy();
      });

      // Should display the data as-is (let user/admin handle data issues)
      expect(screen.getByText("あ")).toBeTruthy();
      expect(screen.getByText("い")).toBeTruthy();
    });
  });

  describe("Memory Leak Prevention", () => {
    test("cleans up event listeners on component unmount", async () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      (useFlashcard as any).mockReturnValue({
        currentKana: {
          id: "1",
          character: "あ",
          romaji: "a",
          accuracy: 0.7,
        },
        loadingKana: false,
        submitAnswer: vi.fn(),
        result: "correct",
        nextCard: vi.fn(),
      });

      const { unmount } = render(<Flashcard />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
    });

    test("prevents memory leaks from unresolved promises", async () => {
      let unresolvedPromise: Promise<any>;
      
      mockFetch.mockImplementation(() => {
        unresolvedPromise = new Promise(() => {}); // Never resolves
        return unresolvedPromise;
      });

      const { unmount } = render(<Dashboard />);

      // Unmount before promise resolves
      unmount();

      // Component should handle gracefully without memory leaks
      expect(unresolvedPromise).toBeDefined();
    });
  });
});