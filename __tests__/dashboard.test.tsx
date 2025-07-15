import { describe, test, expect, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import { mockApiResponse } from "./utils/test-helpers";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Dashboard Component", () => {
  // Create distinct mock data with different characters
  const mockStats = [
    {
      id: "1",
      character: "あ", // Hiragana
      romaji: "a",
      attempts: 10,
      correct_attempts: 8,
      accuracy: 0.8,
    },
    {
      id: "2",
      character: "ア", // Katakana
      romaji: "a",
      attempts: 10,
      correct_attempts: 8,
      accuracy: 0.8,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue(mockApiResponse(mockStats));
    cleanup();
  });

  test("renders dashboard with stats", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeTruthy();
      expect(screen.getByText("Your Progress")).toBeTruthy();
      expect(screen.getByText("あ")).toBeTruthy();
    });
  });

  test("filters by kana type", async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText("Your Progress"));

    // Verify both characters are initially visible
    expect(screen.getByText("あ")).toBeTruthy();
    expect(screen.getByText("ア")).toBeTruthy();

    // Click Hiragana filter using test-id
    await act(async () => {
      fireEvent.click(screen.getByTestId("filter-hiragana"));
    });

    // Katakana character should no longer be visible
    expect(screen.queryByText("ア")).toBeNull();

    // Hiragana character should still be visible
    expect(screen.getByText("あ")).toBeTruthy();
  });

  test("sorts data by columns", async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText("Your Progress"));

    await act(async () => {
      fireEvent.click(screen.getByTestId("sort-character"));
    });

    await waitFor(() => {
      const cells = screen.getAllByRole("cell");
      expect(cells[0].textContent).toBe("あ");
    });
  });

  test("handles API errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    act(() => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to load progress data")).toBeTruthy();
    });
  });
});
