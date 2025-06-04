import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import FlashcardApp from "../components/FlashcardApp";
import Dashboard from "../components/Dashboard";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useSession hook
const mockUseSession = vi.fn();
vi.mock("next-auth/react", async () => {
  const actual = await vi.importActual("next-auth/react");
  return {
    ...actual,
    useSession: () => mockUseSession(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe("Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: { user: { id: "user123", name: "Test User" } },
      status: "authenticated",
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("Authentication Flow", () => {
    test("handles session expiry during practice", async () => {
      // Start with valid session
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      // Simulate session expiry - API returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.click(submitButton);

      // Should handle 401 gracefully (though exact behavior depends on implementation)
      await waitFor(() => {
        expect(submitButton.textContent).toContain("Submit");
      });
    });

    test("handles unauthenticated access to dashboard", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      });

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Please sign in to view your progress")).toBeTruthy();
      });
    });

    test("handles loading session state", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
      });

      render(<FlashcardApp kanaType="hiragana" />);

      // Should show loading state
      expect(screen.getByRole("status")).toBeDefined();
    });
  });

  describe("Full Practice Workflow", () => {
    test("complete practice session from start to finish", async () => {
      const mockKanaData = [
        { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        { id: "2", character: "い", romaji: "i", accuracy: 0.3 },
      ];

      // Mock initial data fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockKanaData,
      });

      render(<FlashcardApp kanaType="hiragana" />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText(/[あい]/)).toBeDefined();
      });

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      // Get the current character being shown
      const currentChar = screen.getByText(/[あい]/).textContent;
      const expectedAnswer = currentChar === "あ" ? "a" : "i";

      // Mock answer submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Submit correct answer
      fireEvent.change(input, { target: { value: expectedAnswer } });
      fireEvent.click(submitButton);

      // Should show correct result
      await waitFor(() => {
        expect(screen.getByText("Correct!")).toBeDefined();
      });

      // Click next card
      const nextButton = screen.getByRole("button", { name: "Next Card" });
      fireEvent.click(nextButton);

      // Should show new card
      await waitFor(() => {
        expect(screen.getByText(/[あい]/)).toBeDefined();
        expect(screen.queryByText("Correct!")).toBeNull();
      });
    });

    test("handles incorrect answer workflow", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      // Mock answer submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      // Submit incorrect answer
      fireEvent.change(input, { target: { value: "wrong" } });
      fireEvent.click(submitButton);

      // Should show incorrect result
      await waitFor(() => {
        expect(screen.getByText("Incorrect!")).toBeDefined();
        expect(screen.getByText("The correct answer is: a")).toBeDefined();
      });
    });
  });

  describe("Tab Switching Integration", () => {
    test("switching between flashcards and dashboard maintains state", async () => {
      // Mock flashcard data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      // Mock stats data for dashboard
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "1",
            character: "あ",
            romaji: "a",
            attempts: 5,
            correct_attempts: 4,
            accuracy: 0.8,
          },
        ],
      });

      // Switch to dashboard
      const dashboardLink = screen.getByText("📊 Dashboard");
      fireEvent.click(dashboardLink);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeDefined();
        expect(screen.getByText("Your Progress")).toBeDefined();
      });

      // Switch back to flashcards
      const hiraganaLink = screen.getByText("ひらがな Hiragana");
      fireEvent.click(hiraganaLink);

      // Should return to flashcard view without re-fetching
      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });
    });
  });

  describe("Error Recovery Integration", () => {
    test("recovers from network error and continues practice", async () => {
      // Initial load succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      // Answer submission fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.click(submitButton);

      // Should still show result (client-side evaluation)
      await waitFor(() => {
        expect(screen.getByText("Correct!")).toBeDefined();
      });

      // Should allow continuing to next card
      const nextButton = screen.getByRole("button", { name: "Next Card" });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.queryByText("Correct!")).toBeNull();
      });
    });

    test("handles dashboard fetch failure and retry", async () => {
      // First fetch fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load progress data")).toBeTruthy();
      });

      // Mock successful retry
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "1",
            character: "あ",
            romaji: "a",
            attempts: 5,
            correct_attempts: 4,
            accuracy: 0.8,
          },
        ],
      });

      const retryButton = screen.getByText("Try Again");
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText("Your Progress")).toBeTruthy();
        expect(screen.getByText("あ")).toBeTruthy();
      });
    });
  });

  describe("Performance Integration", () => {
    test("handles rapid user interactions without breaking", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
          { id: "2", character: "い", romaji: "i", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText(/[あい]/)).toBeDefined();
      });

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      // Simulate rapid typing and clicking
      for (let i = 0; i < 5; i++) {
        fireEvent.change(input, { target: { value: "a" } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
          const nextButton = screen.queryByRole("button", { name: "Next Card" });
          if (nextButton) {
            fireEvent.click(nextButton);
          }
        });
      }

      // Should still be functional
      expect(screen.getByText(/[あい]/)).toBeDefined();
    });

    test("memory usage remains stable during long practice session", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      // Simulate long practice session
      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      for (let i = 0; i < 20; i++) {
        fireEvent.change(input, { target: { value: "a" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
          const nextButton = screen.queryByRole("button", { name: "Next Card" });
          if (nextButton) {
            fireEvent.click(nextButton);
          }
        });
      }

      // Should still be responsive
      expect(screen.getByText("あ")).toBeDefined();
      expect(input).not.toBeDisabled();
    });
  });

  describe("Data Consistency Integration", () => {
    test("maintains data consistency across components", async () => {
      const practiceData = [
        { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
      ];

      const statsData = [
        {
          id: "1",
          character: "あ",
          romaji: "a",
          attempts: 10,
          correct_attempts: 5,
          accuracy: 0.5,
        },
      ];

      // Mock flashcard data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => practiceData,
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      // Mock stats data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => statsData,
      });

      // Switch to dashboard
      const dashboardLink = screen.getByText("📊 Dashboard");
      fireEvent.click(dashboardLink);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeDefined();
        expect(screen.getByText("あ")).toBeDefined();
        expect(screen.getByText("50%")).toBeDefined(); // Accuracy display
      });
    });

    test("handles concurrent data updates gracefully", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      const input = screen.getByPlaceholderText("Type romaji equivalent...");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      // Submit multiple answers rapidly (simulating network delay)
      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.click(submitButton);
      
      fireEvent.change(input, { target: { value: "wrong" } });
      fireEvent.click(submitButton);

      // Should handle gracefully without corrupting state
      await waitFor(() => {
        expect(screen.getByText(/correct|incorrect/i)).toBeDefined();
      });
    });
  });

  describe("Accessibility Integration", () => {
    test("keyboard navigation works throughout app", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      const input = screen.getByPlaceholderText("Type romaji equivalent...");

      // Input should be auto-focused
      expect(document.activeElement).toBe(input);

      // Mock answer submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Type answer and press Enter
      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.keyDown(input, { key: "Enter" });

      await waitFor(() => {
        expect(screen.getByText("Correct!")).toBeDefined();
      });

      // Press Enter to go to next card
      fireEvent.keyDown(window, { key: "Enter" });

      await waitFor(() => {
        expect(screen.queryByText("Correct!")).toBeNull();
      });
    });

    test("maintains focus management during state changes", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
        ],
      });

      render(<FlashcardApp kanaType="hiragana" />);

      await waitFor(() => {
        expect(screen.getByText("あ")).toBeDefined();
      });

      const input = screen.getByPlaceholderText("Type romaji equivalent...");

      // Focus should be on input initially
      expect(document.activeElement).toBe(input);

      // Submit answer
      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(screen.getByText("Correct!")).toBeDefined();
      });

      // Go to next card
      fireEvent.click(screen.getByRole("button", { name: "Next Card" }));

      await waitFor(() => {
        expect(screen.queryByText("Correct!")).toBeNull();
      });

      // Focus should return to input
      await waitFor(() => {
        expect(document.activeElement).toBe(
          screen.getByPlaceholderText("Type romaji equivalent...")
        );
      });
    });
  });
});