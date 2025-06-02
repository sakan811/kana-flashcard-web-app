/*
 * Japanese Kana Flashcard App
 * Copyright (C) 2025  Sakan Nirattisaykul
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, cleanup } from "@testing-library/react";
import {
  FlashcardProvider,
  useFlashcard,
} from "../components/FlashcardProvider";

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("FlashcardProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "1",
          character: "あ",
          romaji: "a",
          accuracy: 0.8,
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("throws if useFlashcard is used outside provider", () => {
    // This should throw an error
    expect(() => renderHook(() => useFlashcard())).toThrow(
      "useFlashcard must be used within a FlashcardProvider",
    );
  });

  it("provides context to children", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FlashcardProvider kanaType="hiragana">{children}</FlashcardProvider>
    );

    const { result } = renderHook(() => useFlashcard(), { wrapper });

    expect(result.current).toHaveProperty("currentKana");
    expect(result.current).toHaveProperty("submitAnswer");
    expect(result.current).toHaveProperty("nextCard");
    expect(result.current).toHaveProperty("loadingKana");
    expect(result.current).toHaveProperty("result");
  });
});
