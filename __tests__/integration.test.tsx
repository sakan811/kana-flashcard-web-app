import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FlashcardApp from "../components/FlashcardApp";
import { mockApiResponse, mockKana, mockSession } from "./utils/test-helpers";

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock("next-auth/react", () => ({
  useSession: () => mockSession(),
  SessionProvider: ({ children }) => <div>{children}</div>,
}));

describe("Integration Tests", () => {
  test("complete practice workflow", async () => {
    // Mock the initial flashcards fetch
    mockFetch
      .mockResolvedValueOnce(mockApiResponse([mockKana.basic]))
      // Mock the submit endpoint
      .mockResolvedValueOnce(mockApiResponse({ success: true }));

    render(<FlashcardApp kanaType="hiragana" />);

    await waitFor(() => screen.getByText("あ"));

    // Submit answer
    const input = screen.getByPlaceholderText("Type romaji equivalent...");
    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    // Wait for the result to appear
    await waitFor(() => screen.getByText("Correct!"));

    // Wait for the Next Card button to appear
    await waitFor(() => screen.getByRole("button", { name: "Next Card" }));

    // Click next card
    fireEvent.click(screen.getByRole("button", { name: "Next Card" }));

    await waitFor(() => expect(screen.queryByText("Correct!")).toBeNull());
  });

  test("handles authentication errors", async () => {
    mockFetch.mockResolvedValue(mockApiResponse(null, false));

    render(<FlashcardApp kanaType="hiragana" />);

    // Should handle gracefully without crashing
    expect(screen.getByRole("status")).toBeDefined();
  });
});
