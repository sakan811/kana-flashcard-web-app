import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import { FlashcardProvider, useFlashcard } from "@/components/FlashcardProvider";

const mockFetch = vi.fn();
global.fetch = mockFetch;

function AccuracyTestComponent() {
  const { currentKana, submitAnswer, result } = useFlashcard();
  
  return (
    <div>
      {currentKana && (
        <>
          <span data-testid="current-kana">{currentKana.character}</span>
          <span data-testid="current-accuracy">{currentKana.accuracy}</span>
          <button 
            data-testid="submit-correct" 
            onClick={() => submitAnswer(currentKana.romaji)}
          >
            Submit Correct
          </button>
          <button 
            data-testid="submit-incorrect" 
            onClick={() => submitAnswer("wrong")}
          >
            Submit Incorrect
          </button>
          {result && <span data-testid="result">{result}</span>}
        </>
      )}
    </div>
  );
}

describe("FlashcardProvider - Accuracy Calculation", () => {
  const mockKanaData = [
    { id: "1", character: "あ", romaji: "a", accuracy: 0.5 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockKanaData,
      })
      // Mock the submit endpoint responses
      .mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
  });

  test("submits correct answer with proper payload", async () => {
    const { getByTestId } = render(
      <FlashcardProvider>
        <AccuracyTestComponent />
      </FlashcardProvider>
    );

    await waitFor(() => {
      expect(getByTestId("current-kana")).toBeInTheDocument();
    });

    await act(async () => {
      getByTestId("submit-correct").click();
    });

    // Verify the submit API was called with correct data
    expect(mockFetch).toHaveBeenCalledWith("/api/flashcards/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kanaId: "1",
        isCorrect: true,
        interactionMode: "typing", // Default mode
      }),
    });

    await waitFor(() => {
      expect(getByTestId("result")).toHaveTextContent("correct");
    });
  });

  test("submits incorrect answer with proper payload", async () => {
    const { getByTestId } = render(
      <FlashcardProvider>
        <AccuracyTestComponent />
      </FlashcardProvider>
    );

    await waitFor(() => {
      expect(getByTestId("current-kana")).toBeInTheDocument();
    });

    await act(async () => {
      getByTestId("submit-incorrect").click();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/flashcards/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kanaId: "1",
        isCorrect: false,
        interactionMode: "typing",
      }),
    });

    await waitFor(() => {
      expect(getByTestId("result")).toHaveTextContent("incorrect");
    });
  });

  test("handles case-insensitive answer comparison", async () => {
    const upperCaseKana = [
      { id: "1", character: "あ", romaji: "A", accuracy: 0.5 },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => upperCaseKana,
    });

    function CaseTestComponent() {
      const { currentKana, submitAnswer, result } = useFlashcard();
      
      return (
        <div>
          {currentKana && (
            <>
              <button 
                data-testid="submit-lowercase" 
                onClick={() => submitAnswer("a")}
              >
                Submit Lowercase
              </button>
              <button 
                data-testid="submit-uppercase" 
                onClick={() => submitAnswer("A")}
              >
                Submit Uppercase
              </button>
              {result && <span data-testid="result">{result}</span>}
            </>
          )}
        </div>
      );
    }

    const { getByTestId } = render(
      <FlashcardProvider>
        <CaseTestComponent />
      </FlashcardProvider>
    );

    await waitFor(() => {
      expect(getByTestId("submit-lowercase")).toBeInTheDocument();
    });

    // Test lowercase input against uppercase romaji
    await act(async () => {
      getByTestId("submit-lowercase").click();
    });

    await waitFor(() => {
      expect(getByTestId("result")).toHaveTextContent("correct");
    });
  });

  test("trims whitespace from user input", async () => {
    function WhitespaceTestComponent() {
      const { currentKana, submitAnswer, result } = useFlashcard();
      
      return (
        <div>
          {currentKana && (
            <>
              <button 
                data-testid="submit-whitespace" 
                onClick={() => submitAnswer("  a  ")}
              >
                Submit With Whitespace
              </button>
              {result && <span data-testid="result">{result}</span>}
            </>
          )}
        </div>
      );
    }

    const { getByTestId } = render(
      <FlashcardProvider>
        <WhitespaceTestComponent />
      </FlashcardProvider>
    );

    await waitFor(() => {
      expect(getByTestId("submit-whitespace")).toBeInTheDocument();
    });

    await act(async () => {
      getByTestId("submit-whitespace").click();
    });

    await waitFor(() => {
      expect(getByTestId("result")).toHaveTextContent("correct");
    });
  });

  test("handles API submission errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockKanaData,
      })
      .mockRejectedValueOnce(new Error("Network error"));

    const { getByTestId } = render(
      <FlashcardProvider>
        <AccuracyTestComponent />
      </FlashcardProvider>
    );

    await waitFor(() => {
      expect(getByTestId("current-kana")).toBeInTheDocument();
    });

    await act(async () => {
      getByTestId("submit-correct").click();
    });

    // Should still show result even if API fails
    await waitFor(() => {
      expect(getByTestId("result")).toHaveTextContent("correct");
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error submitting answer:", expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  test("includes interaction mode in submission payload", async () => {
    function ModeTestComponent() {
      const { currentKana, submitAnswer, setInteractionMode } = useFlashcard();
      
      return (
        <div>
          {currentKana && (
            <>
              <button 
                data-testid="set-multiple-choice" 
                onClick={() => setInteractionMode("multiple-choice")}
              >
                Set Multiple Choice
              </button>
              <button 
                data-testid="submit-answer" 
                onClick={() => submitAnswer(currentKana.romaji)}
              >
                Submit
              </button>
            </>
          )}
        </div>
      );
    }

    const { getByTestId } = render(
      <FlashcardProvider>
        <ModeTestComponent />
      </FlashcardProvider>
    );

    await waitFor(() => {
      expect(getByTestId("set-multiple-choice")).toBeInTheDocument();
    });

    // Change to multiple choice mode
    await act(async () => {
      getByTestId("set-multiple-choice").click();
    });

    await act(async () => {
      getByTestId("submit-answer").click();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/flashcards/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kanaId: "1",
        isCorrect: true,
        interactionMode: "multiple-choice",
      }),
    });
  });
});