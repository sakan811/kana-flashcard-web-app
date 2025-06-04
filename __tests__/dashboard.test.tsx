import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import { mockApiResponse, mockKana } from "./utils/test-helpers";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Dashboard Component", () => {
  const mockStats = [
    { ...mockKana.withStats },
    { ...mockKana.withStats, id: "2", character: "ア", romaji: "a" }
  ];

  beforeEach(() => {
    mockFetch.mockResolvedValue(mockApiResponse(mockStats));
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
    
    fireEvent.click(screen.getByRole("button", { name: "Hiragana" }));
    
    await waitFor(() => {
      expect(screen.getByText("あ")).toBeTruthy();
      expect(screen.queryByText("ア")).toBeNull();
    });
  });

  test("sorts data by columns", async () => {
    render(<Dashboard />);
    
    await waitFor(() => screen.getByText("Your Progress"));
    
    fireEvent.click(screen.getByText("Character"));
    
    await waitFor(() => {
      const cells = screen.getAllByRole("cell");
      expect(cells[0].textContent).toBe("あ");
    });
  });

  test("handles API errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText("Failed to load progress data")).toBeTruthy();
    });
  });
});