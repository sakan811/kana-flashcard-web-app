import { render, screen, fireEvent } from '@testing-library/react';
import { PerformanceData } from '@/components/funcs/showKanaFunc';
import KanaPerformanceTable, {Column} from "../../src/components/performanceTable/kanaPerformanceTable";
import React from "react";
import {describe, test, expect, beforeAll, vi} from 'vitest'
import '@testing-library/jest-dom';

const mockPerformanceData: PerformanceData[] = [
  { kana: 'あ', romanji: 'a', correct_answer: 1, accuracy: 100, total_answer: 10 },
  { kana: 'い', romanji: 'i', correct_answer: 1, accuracy: 80, total_answer: 5 },
  { kana: 'う', romanji: 'u', correct_answer: 1, accuracy: 50, total_answer: 0 },
];

const columns: Column[] = [
  { key: 'kana', header: 'Kana' },
  { key: 'accuracy', header: 'Accuracy' },
  { key: 'total_answer', header: 'Total Answer' }
];

describe('KanaPerformanceTable', () => {
    beforeAll(() => {
      window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

  test('renders button and hides table initially', () => {
    render(
      <KanaPerformanceTable
        performanceData={mockPerformanceData}
        columns={columns}
        title="Performance Table"
      />
    );

    // Check that the button is present
    const button = screen.getByText(/show performance table/i);
    expect(button).toBeInTheDocument();

    // Ensure table is not displayed initially
    const table = screen.queryByRole('table');
    expect(table).not.toBeInTheDocument();
  });

  test('shows table when button is clicked', () => {
    render(
      <KanaPerformanceTable
        performanceData={mockPerformanceData}
        columns={columns}
        title="Performance Table"
      />
    );

    const button = screen.getByText(/show performance table/i);
    fireEvent.click(button);

    // Table should now be visible
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });
});
