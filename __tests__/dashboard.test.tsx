import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import Dashboard from "../components/Dashboard";

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Dashboard", () => {
  const mockStats = [
    {
      id: "1",
      character: "あ",
      romaji: "a",
      attempts: 10,
      correct_attempts: 8,
      accuracy: 0.8,
    },
    {
      id: "2",
      character: "い",
      romaji: "i",
      attempts: 5,
      correct_attempts: 3,
      accuracy: 0.6,
    },
    {
      id: "3",
      character: "ア",
      romaji: "a",
      attempts: 7,
      correct_attempts: 6,
      accuracy: 0.86,
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock successful fetch response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockStats,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup(); // Ensure DOM is cleaned between tests
  });

  test("renders dashboard title", async () => {
    render(<Dashboard />);

    // Use getByRole with name for more specificity
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Dashboard", level: 1 }),
      ).toBeTruthy();
    });
  });

  test("fetches and displays user stats", async () => {
    render(<Dashboard />);

    // Check that fetch was called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/stats");
    });

    // Use getByText with a more specific container if needed
    await waitFor(() => {
      expect(screen.getByText("Total Characters Practiced")).toBeTruthy();
      expect(screen.getByText("3")).toBeTruthy(); // Total characters with attempts > 0
    });
  });

  test("filters stats by type", async () => {
    render(<Dashboard />);

    // Wait for data to load using a different element for checking
    await waitFor(() => {
      expect(screen.getByText("Your Progress")).toBeTruthy();
    });

    // Click the hiragana filter button
    const hiraganaButton = screen.getByRole("button", { name: "Hiragana" });
    fireEvent.click(hiraganaButton);

    // Ensure only hiragana characters are shown
    await waitFor(() => {
      expect(screen.getByText("あ")).toBeTruthy();
      expect(screen.getByText("い")).toBeTruthy();
      // ア should not be visible in the table after filtering
    });

    // Click the katakana filter button
    const katakanaButton = screen.getByRole("button", { name: "Katakana" });
    fireEvent.click(katakanaButton);

    // Ensure only katakana characters are shown
    await waitFor(() => {
      expect(screen.getByText("ア")).toBeTruthy();
      // あ and い should not be visible in the table after filtering
    });
  });
});
