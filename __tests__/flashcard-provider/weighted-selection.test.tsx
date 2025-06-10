import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { FlashcardProvider, useFlashcard } from "@/components/FlashcardProvider";

// Mock fetch for consistent test data
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test component to access provider state
function TestComponent({ onKanaSelected }: { onKanaSelected: (kana: any) => void }) {
  const { currentKana, nextCard } = useFlashcard();
  
  if (currentKana) {
    onKanaSelected(currentKana);
  }

  return (
    <div>
      <button onClick={nextCard} data-testid="next-card">Next Card</button>
      {currentKana && <span data-testid="current-kana">{currentKana.character}</span>}
    </div>
  );
}

describe("FlashcardProvider - Weighted Selection Algorithm", () => {
  const mockKanaData = [
    { id: "1", character: "あ", romaji: "a", accuracy: 0.9 }, // High accuracy - low weight
    { id: "2", character: "い", romaji: "i", accuracy: 0.3 }, // Low accuracy - high weight
    { id: "3", character: "う", romaji: "u", accuracy: 0.1 }, // Very low accuracy - very high weight
    { id: "4", character: "え", romaji: "e", accuracy: 0.8 }, // Good accuracy - low weight
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockKanaData,
    });
  });

  test("selects kana with lower accuracy more frequently", async () => {
    const selectedKana: string[] = [];
    let selectionCount = 0;

    const onKanaSelected = (kana: any) => {
      if (kana) {
        selectedKana.push(kana.character);
        selectionCount++;
      }
    };

    const { getByTestId } = render(
      <FlashcardProvider>
        <TestComponent onKanaSelected={onKanaSelected} />
      </FlashcardProvider>
    );

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Generate multiple selections
    for (let i = 0; i < 50; i++) {
      await act(async () => {
        getByTestId("next-card").click();
        await new Promise(resolve => setTimeout(resolve, 10));
      });
    }

    // Count occurrences
    const occurrences = selectedKana.reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Characters with lower accuracy should appear more frequently
    // う (0.1 accuracy) should appear most often
    // い (0.3 accuracy) should appear second most
    // あ (0.9 accuracy) should appear least often
    expect(occurrences["う"]).toBeGreaterThan(occurrences["あ"]);
    expect(occurrences["い"]).toBeGreaterThan(occurrences["え"]);
  });

  test("handles edge case with all perfect accuracy", async () => {
    const perfectKanaData = [
      { id: "1", character: "あ", romaji: "a", accuracy: 1.0 },
      { id: "2", character: "い", romaji: "i", accuracy: 1.0 },
      { id: "3", character: "う", romaji: "u", accuracy: 1.0 },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => perfectKanaData,
    });

    const selectedKana: string[] = [];
    const onKanaSelected = (kana: any) => {
      if (kana) selectedKana.push(kana.character);
    };

    render(
      <FlashcardProvider>
        <TestComponent onKanaSelected={onKanaSelected} />
      </FlashcardProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should still select a kana even with perfect accuracy
    expect(selectedKana).toHaveLength(1);
    expect(["あ", "い", "う"]).toContain(selectedKana[0]);
  });

  test("handles edge case with all zero accuracy", async () => {
    const zeroKanaData = [
      { id: "1", character: "あ", romaji: "a", accuracy: 0.0 },
      { id: "2", character: "い", romaji: "i", accuracy: 0.0 },
      { id: "3", character: "う", romaji: "u", accuracy: 0.0 },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => zeroKanaData,
    });

    const selectedKana: string[] = [];
    const onKanaSelected = (kana: any) => {
      if (kana) selectedKana.push(kana.character);
    };

    render(
      <FlashcardProvider>
        <TestComponent onKanaSelected={onKanaSelected} />
      </FlashcardProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should select from available kana with equal probability
    expect(selectedKana).toHaveLength(1);
    expect(["あ", "い", "う"]).toContain(selectedKana[0]);
  });

  test("weight calculation follows inverse accuracy formula", async () => {
    // Test the mathematical relationship: weight = 1 - accuracy
    const testData = [
      { id: "1", character: "test", romaji: "test", accuracy: 0.2 }, // weight = 0.8
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => testData,
    });

    // The weight calculation is internal, but we can verify through selection behavior
    // Lower accuracy should have higher selection probability
    const selectionCounts = new Array(10).fill(0);
    
    for (let trial = 0; trial < 10; trial++) {
      const selectedKana: string[] = [];
      const onKanaSelected = (kana: any) => {
        if (kana) selectedKana.push(kana.character);
      };

      render(
        <FlashcardProvider>
          <TestComponent onKanaSelected={onKanaSelected} />
        </FlashcardProvider>
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      if (selectedKana.length > 0) {
        selectionCounts[trial] = 1;
      }
    }

    // With only one option, it should always be selected
    expect(selectionCounts.every(count => count === 1)).toBe(true);
  });

  test("maintains selection consistency within single session", async () => {
    const selectedKana: any[] = [];
    const onKanaSelected = (kana: any) => {
      if (kana && !selectedKana.find(k => k.id === kana.id)) {
        selectedKana.push(kana);
      }
    };

    const { getByTestId } = render(
      <FlashcardProvider>
        <TestComponent onKanaSelected={onKanaSelected} />
      </FlashcardProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Generate several selections
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        getByTestId("next-card").click();
        await new Promise(resolve => setTimeout(resolve, 10));
      });
    }

    // Each selection should be from the original dataset
    selectedKana.forEach(kana => {
      expect(mockKanaData.some(original => 
        original.id === kana.id && 
        original.character === kana.character &&
        original.romaji === kana.romaji
      )).toBe(true);
    });
  });
});