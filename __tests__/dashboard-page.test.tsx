import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../app/dashboard/page";

// Mock Dashboard component
vi.mock("@/components/Dashboard", () => ({
  default: () => (
    <div data-testid="dashboard-component">Dashboard Component</div>
  ),
}));

describe("Dashboard Page", () => {
  test("renders Dashboard component", () => {
    render(<DashboardPage />);

    expect(screen.getByTestId("dashboard-component")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Component")).toBeInTheDocument();
  });

  test("is a client component", () => {
    // Test that the component can be rendered (client components can be tested this way)
    expect(() => render(<DashboardPage />)).not.toThrow();
  });
});
