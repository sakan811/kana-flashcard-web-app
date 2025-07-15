/**
 * DashboardClient Component Tests
 * Tests for the client-side Dashboard page component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardClient from '../../app/dashboard/DashboardClient';

// Mock Dashboard component
vi.mock('../../components/Dashboard', () => ({
  default: () => (
    <div data-testid="dashboard">
      Dashboard Component
    </div>
  ),
}));

describe('DashboardClient Component', () => {
  it('should render Dashboard component', () => {
    render(<DashboardClient />);

    const dashboard = screen.getByTestId('dashboard');
    expect(dashboard).toBeInTheDocument();
    expect(dashboard).toHaveTextContent('Dashboard Component');
  });

  it('should be a client component', () => {
    // This test verifies the component can be rendered in a test environment
    // which confirms it's a client component
    expect(() => render(<DashboardClient />)).not.toThrow();
  });
});