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

test('renders the correct table headers', () => {
  render(
    <KanaPerformanceTable
      performanceData={mockPerformanceData}
      columns={columns}
      title="Performance Table"
    />
  );

  fireEvent.click(screen.getByText(/show performance table/i));

  // Check headers
  const headers = screen.getAllByRole('columnheader');
  expect(headers[0]).toHaveTextContent('Kana');
  expect(headers[1]).toHaveTextContent('Accuracy');
  expect(headers[2]).toHaveTextContent('Total Answer');
});

test('renders correct kana in Kana column for both hiragana and katakana', () => {
  const hiraganaData = [{ kana: 'あ', romanji: 'a', correct_answer: 1, accuracy: 100, total_answer: 10 }];
  const katakanaData = [{ kana: 'ア', romanji: 'a', correct_answer: 1, accuracy: 100, total_answer: 10 }];

  const { rerender } = render(
    <KanaPerformanceTable
      performanceData={hiraganaData}
      columns={columns}
      title="Hiragana Performance"
    />
  );

  fireEvent.click(screen.getByText(/show performance table/i));
  expect(screen.getByRole('cell', { name: 'あ' })).toBeInTheDocument();

  rerender(
    <KanaPerformanceTable
      performanceData={katakanaData}
      columns={columns}
      title="Katakana Performance"
    />
  );

  fireEvent.click(screen.getByText(/hide performance table/i));
  fireEvent.click(screen.getByText(/show performance table/i));
  expect(screen.getByRole('cell', { name: 'ア' })).toBeInTheDocument();
});