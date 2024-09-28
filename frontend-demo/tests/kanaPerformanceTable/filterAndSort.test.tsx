import { render, screen, fireEvent } from '@testing-library/react';
import { PerformanceData } from '@/components/funcs/showKanaFunc';
import KanaPerformanceTable, {Column} from "../../src/components/performanceTable/kanaPerformanceTable";
import React from "react";
import {test, expect, beforeAll, vi} from 'vitest'
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

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

test('filters and sorts the performance data', () => {
  render(
    <KanaPerformanceTable
      performanceData={mockPerformanceData}
      columns={columns}
      title="Performance Table"
    />
  );

  // Show the table by clicking the button
  const button = screen.getByText(/show performance table/i);
  fireEvent.click(button);

  const rows = screen.getAllByRole('row');
  // First row should be the one with accuracy 100, as it is sorted by accuracy
  expect(rows[1]).toHaveTextContent('あ');
  expect(rows[2]).toHaveTextContent('い');

  // Ensure 'う' (with total_answer = 0) is filtered out
  expect(screen.queryByText('う')).not.toBeInTheDocument();
});
