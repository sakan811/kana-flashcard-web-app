import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ProtectedRoute, withProtection } from "../components/ProtectedRoute";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
}));

describe("ProtectedRoute Component", () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (useRouter as any).mockReturnValue({
      replace: mockReplace,
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("renders children when authenticated", () => {
    // Mock authenticated session
    (useSession as any).mockReturnValue({
      status: "authenticated",
      data: { user: { name: "Test User" } },
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId("protected-content")).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test("shows loading state when session is loading", () => {
    // Mock loading session
    (useSession as any).mockReturnValue({
      status: "loading",
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    // Default loading spinner is shown
    expect(screen.queryByTestId("protected-content")).toBeNull();
    const spinnerElement = document.querySelector(".animate-spin");
    expect(spinnerElement).toBeTruthy();
  });

  test("redirects to login when unauthenticated", () => {
    // Mock unauthenticated session
    (useSession as any).mockReturnValue({
      status: "unauthenticated",
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    // Protected content should not be rendered
    expect(screen.queryByTestId("protected-content")).toBeNull();
    // Should redirect to login
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  test("redirects to custom path when specified", () => {
    // Mock unauthenticated session
    (useSession as any).mockReturnValue({
      status: "unauthenticated",
    });

    render(
      <ProtectedRoute redirectTo="/custom-login">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    // Should redirect to custom path
    expect(mockReplace).toHaveBeenCalledWith("/custom-login");
  });

  test("renders custom fallback when provided", () => {
    // Mock loading session
    (useSession as any).mockReturnValue({
      status: "loading",
    });

    render(
      <ProtectedRoute
        fallback={<div data-testid="custom-fallback">Custom Loading</div>}
      >
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    // Custom fallback should be rendered
    expect(screen.queryByTestId("protected-content")).toBeNull();
    expect(screen.getByTestId("custom-fallback")).toBeTruthy();
  });

  test("withProtection HOC works correctly", () => {
    // Mock authenticated session
    (useSession as any).mockReturnValue({
      status: "authenticated",
      data: { user: { name: "Test User" } },
    });

    // Create a test component
    const TestComponent = () => (
      <div data-testid="test-component">Test Component</div>
    );

    // Wrap it with protection
    const ProtectedComponent = withProtection(TestComponent);

    render(<ProtectedComponent />);

    // Component should be rendered when authenticated
    expect(screen.getByTestId("test-component")).toBeTruthy();
  });
});
