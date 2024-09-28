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

test('renders the correct table title', () => {
  render(
    <KanaPerformanceTable
      performanceData={mockPerformanceData}
      columns={columns}
      title="Performance Table"
    />
  );

  fireEvent.click(screen.getByText(/show performance table/i));

  // Check if the title is correctly rendered
  const title = screen.getByText('Performance Table');
  expect(title).toBeInTheDocument();
});
