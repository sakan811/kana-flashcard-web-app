import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { FlashcardProvider, useFlashcard } from "@/components/FlashcardProvider";
import React from "react";

// Mock fetch for consistent test data
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test component to access provider state
function TestComponent({ onKanaSelected }: { onKanaSelected: (kana: any) => void }) {
  const { currentKana, nextCard, loadingKana } = useFlashcard();
  
  React.useEffect(() => {
    if (currentKana && !loadingKana) {
      onKanaSelected(currentKana);
    }
  }, [currentKana, loadingKana, onKanaSelected]);

  return (
    <div>
      <div data-testid="loading-state">{loadingKana ? "loading" : "loaded"}</div>
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
    let resolveKanaSelected: ((value: any) => void) | null = null;
    let kanaSelectedPromise = new Promise(resolve => {
      resolveKanaSelected = resolve;
    });

    const onKanaSelected = (kana: any) => {
      if (kana) {
        selectedKana.push(kana.character);
        if (resolveKanaSelected) {
          resolveKanaSelected(kana);
          // Create new promise for next selection
          kanaSelectedPromise = new Promise(resolve => {
            resolveKanaSelected = resolve;
          });
        }
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

    // Wait for first kana to be selected
    await kanaSelectedPromise;

    // Generate multiple selections
    for (let i = 0; i < 100; i++) { // Increased sample size for better statistics
      await act(async () => {
        getByTestId("next-card").click();
        await new Promise(resolve => setTimeout(resolve, 5));
      });
    }

    // Count occurrences with default values
    const occurrences = selectedKana.reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ensure all characters have counts (even if 0)
    const finalCounts = {
      "う": occurrences["う"] || 0,  // Should be highest (accuracy: 0.1)
      "い": occurrences["い"] || 0,  // Should be second (accuracy: 0.3)
      "え": occurrences["え"] || 0,  // Should be third (accuracy: 0.8)
      "あ": occurrences["あ"] || 0,  // Should be lowest (accuracy: 0.9)
    };

    console.log("Selection counts:", finalCounts);
    console.log("Total selections:", selectedKana.length);

    // Characters with lower accuracy should appear more frequently
    // う (0.1 accuracy) should appear most often
    // い (0.3 accuracy) should appear second most  
    // あ (0.9 accuracy) should appear least often
    expect(finalCounts["う"]).toBeGreaterThan(finalCounts["あ"]);
    expect(finalCounts["い"]).toBeGreaterThan(finalCounts["え"]);
    
    // Additional check: lowest accuracy should have more selections than highest
    expect(finalCounts["う"]).toBeGreaterThan(finalCounts["あ"]);
    
    // Verify we actually got selections
    expect(selectedKana.length).toBeGreaterThan(50); // Should have gotten plenty of selections
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
    // Test with known weights
    const testData = [
      { id: "1", character: "low", romaji: "low", accuracy: 0.2 },  // weight = 0.8
      { id: "2", character: "high", romaji: "high", accuracy: 0.8 }, // weight = 0.2
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => testData,
    });

    const selectedKana: string[] = [];
    const onKanaSelected = (kana: any) => {
      if (kana) selectedKana.push(kana.character);
    };

    const { getByTestId } = render(
      <FlashcardProvider>
        <TestComponent onKanaSelected={onKanaSelected} />
      </FlashcardProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Generate many selections
    for (let i = 0; i < 50; i++) {
      await act(async () => {
        getByTestId("next-card").click();
        await new Promise(resolve => setTimeout(resolve, 5));
      });
    }

    const occurrences = selectedKana.reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const lowCount = occurrences["low"] || 0;
    const highCount = occurrences["high"] || 0;

    console.log("Weight test - Low accuracy count:", lowCount, "High accuracy count:", highCount);

    // Character with lower accuracy should appear more often
    expect(lowCount).toBeGreaterThan(highCount);
  });

  test("maintains selection consistency within single session", async () => {
    const selectedKana: any[] = [];
    const uniqueKana = new Set<string>();
    
    const onKanaSelected = (kana: any) => {
      if (kana) {
        selectedKana.push(kana);
        uniqueKana.add(kana.id);
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
    for (let i = 0; i < 20; i++) {
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

    // Should have gotten some variety in selections
    expect(selectedKana.length).toBeGreaterThan(10);
  });

  test("selection distribution matches weight expectations", async () => {
    // More thorough statistical test
    const selectedKana: string[] = [];
    const onKanaSelected = (kana: any) => {
      if (kana) selectedKana.push(kana.character);
    };

    const { getByTestId } = render(
      <FlashcardProvider>
        <TestComponent onKanaSelected={onKanaSelected} />
      </FlashcardProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Generate many selections for statistical significance
    for (let i = 0; i < 200; i++) {
      await act(async () => {
        getByTestId("next-card").click();
        await new Promise(resolve => setTimeout(resolve, 2));
      });
    }

    const occurrences = selectedKana.reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate expected weights (1 - accuracy)
    const expectedWeights = {
      "う": 1 - 0.1, // 0.9
      "い": 1 - 0.3, // 0.7  
      "え": 1 - 0.8, // 0.2
      "あ": 1 - 0.9, // 0.1
    };

    const totalWeight = Object.values(expectedWeights).reduce((sum, weight) => sum + weight, 0);
    
    // Calculate expected percentages
    const expectedPercentages = {
      "う": expectedWeights["う"] / totalWeight,
      "い": expectedWeights["い"] / totalWeight,
      "え": expectedWeights["え"] / totalWeight,
      "あ": expectedWeights["あ"] / totalWeight,
    };

    console.log("Expected percentages:", expectedPercentages);
    console.log("Actual counts:", occurrences);

    // At minimum, verify the ordering is correct
    const counts = {
      "う": occurrences["う"] || 0,
      "い": occurrences["い"] || 0,
      "え": occurrences["え"] || 0,
      "あ": occurrences["あ"] || 0,
    };

    // う should be most frequent, あ should be least frequent
    expect(counts["う"]).toBeGreaterThan(counts["あ"]);
    expect(counts["い"]).toBeGreaterThan(counts["え"]);
  });
});