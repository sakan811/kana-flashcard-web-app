import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanaPerformanceTable from '../../src/components/performanceTable/kanaPerformanceTable';

const mockPerformanceData = [
  { key1: 'Value1', key2: 'Value2' },
  { key1: 'Value3', key2: 'Value4' }
];

const mockColumns = [
  { key: 'key1', header: 'Header 1' },
  { key: 'key2', header: 'Header 2' }
];

// Mocking scrollIntoView
const scrollIntoViewMock = vi.fn();


describe('KanaPerformanceTable', () => {
  it('should render the button and toggle table visibility', () => {
    render(
      <KanaPerformanceTable
        performanceData={mockPerformanceData}
        columns={mockColumns}
        title="Test Table"
      />
    );

    // Override scrollIntoView with the mock
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: scrollIntoViewMock,
      configurable: true,
    });

    // Check if the button is rendered
    const button = screen.getByText('Show Performance Table');
    expect(button).not.toBeNull();

    // Check if the table is initially not rendered
    expect(screen.queryByText('Test Table')).toBeNull();

    // Click the button to show the table
    fireEvent.click(button);

    // Check if the table is now rendered
    expect(screen.getByText('Test Table')).not.toBeNull();
    expect(screen.getByText('Header 1')).not.toBeNull();
    expect(screen.getByText('Header 2')).not.toBeNull();
    expect(screen.getByText('Value1')).not.toBeNull();
    expect(screen.getByText('Value2')).not.toBeNull();
  });

  it('should scroll to the table when showing it', () => {
    render(
      <KanaPerformanceTable
        performanceData={mockPerformanceData}
        columns={mockColumns}
        title="Test Table"
      />
    );

    // Override scrollIntoView with the mock
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: scrollIntoViewMock,
      configurable: true,
    });

    // Act: Click the button to show the table
    fireEvent.click(screen.getByText('Show Performance Table'));

    // Assert: Check that scrollIntoView has been called
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});
