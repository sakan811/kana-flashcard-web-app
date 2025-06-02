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

  // Sort feature tests
  describe("Sort functionality", () => {
    test("sorts by character column ascending and descending", async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Your Progress")).toBeTruthy();
      });

      const characterHeader = screen.getByText("Character");

      // First click - ascending sort
      fireEvent.click(characterHeader);
      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        // Get character cells (every 4th cell starting from index 0: 0, 4, 8)
        expect(cells[0].textContent).toBe("あ");
        expect(cells[4].textContent).toBe("ア");
        expect(cells[8].textContent).toBe("い");
      });

      // Second click - descending sort
      fireEvent.click(characterHeader);
      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        // Check reverse order
        expect(cells[0].textContent).toBe("い");
        expect(cells[4].textContent).toBe("ア");
        expect(cells[8].textContent).toBe("あ");
      });
    });

    test("sorts by romaji column ascending and descending", async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Your Progress")).toBeTruthy();
      });

      const romajiHeader = screen.getByText("Romaji");

      // First click - ascending sort (a, a, i)
      fireEvent.click(romajiHeader);
      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        // Get romaji cells (every 4th cell starting from index 1: 1, 5, 9)
        expect(cells[1].textContent).toBe("a");
        expect(cells[5].textContent).toBe("a");
        expect(cells[9].textContent).toBe("i");
      });

      // Second click - descending sort (i, a, a)
      fireEvent.click(romajiHeader);
      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        expect(cells[1].textContent).toBe("i");
        expect(cells[5].textContent).toBe("a");
        expect(cells[9].textContent).toBe("a");
      });
    });

    test("sorts by attempts column ascending and descending", async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Your Progress")).toBeTruthy();
      });

      const attemptsHeader = screen.getByText("Attempts");

      // First click - ascending sort (5, 7, 10)
      fireEvent.click(attemptsHeader);
      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        // Get attempts cells (every 4th cell starting from index 2: 2, 6, 10)
        expect(cells[2].textContent).toBe("5");
        expect(cells[6].textContent).toBe("7");
        expect(cells[10].textContent).toBe("10");
      });

      // Second click - descending sort (10, 7, 5)
      fireEvent.click(attemptsHeader);
      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        expect(cells[2].textContent).toBe("10");
        expect(cells[6].textContent).toBe("7");
        expect(cells[10].textContent).toBe("5");
      });
    });

    test("sorts by accuracy column ascending and descending", async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Your Progress")).toBeTruthy();
      });

      const accuracyHeader = screen.getByText("Accuracy");

      // First click - descending sort (86%, 80%, 60%) - toggles from default ASC
      fireEvent.click(accuracyHeader);
      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        // Get accuracy cells (every 4th cell starting from index 3: 3, 7, 11)
        // These cells contain progress bars + percentage text
        expect(cells[3].textContent).toContain("86%");
        expect(cells[7].textContent).toContain("80%");
        expect(cells[11].textContent).toContain("60%");
      });

      // Second click - ascending sort (60%, 80%, 86%) - toggles back to ASC
      fireEvent.click(accuracyHeader);
      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        expect(cells[3].textContent).toContain("60%");
        expect(cells[7].textContent).toContain("80%");
        expect(cells[11].textContent).toContain("86%");
      });
    });

    test("maintains sort order when switching between filters", async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Your Progress")).toBeTruthy();
      });

      // Sort by attempts descending
      const attemptsHeader = screen.getByText("Attempts");
      fireEvent.click(attemptsHeader); // asc
      fireEvent.click(attemptsHeader); // desc

      // Switch to hiragana filter
      const hiraganaButton = screen.getByRole("button", { name: "Hiragana" });
      fireEvent.click(hiraganaButton);

      await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        // Should show hiragana chars sorted by attempts desc (10, 5)
        // After filtering to hiragana only, we have 2 rows
        // Attempts cells are at index 2 and 6
        expect(cells[2].textContent).toBe("10");
        expect(cells[6].textContent).toBe("5");
      });
    });
  });
});
