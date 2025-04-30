import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { FlashcardProvider, useFlashcard } from "../components/FlashcardProvider";
import { SessionProvider } from "next-auth/react";

describe("FlashcardProvider", () => {
  it("throws if useFlashcard is used outside provider", () => {
    expect(() => useFlashcard()).toThrow();
  });
  it("provides context to children", () => {
    const wrapper = ({ children }) => (
      <SessionProvider>
        <FlashcardProvider kanaType="hiragana">{children}</FlashcardProvider>
      </SessionProvider>
    );
    const { result } = renderHook(() => useFlashcard(), { wrapper });
    expect(result.current).toHaveProperty("currentKana");
    expect(result.current).toHaveProperty("submitAnswer");
    expect(result.current).toHaveProperty("nextCard");
  });
});
