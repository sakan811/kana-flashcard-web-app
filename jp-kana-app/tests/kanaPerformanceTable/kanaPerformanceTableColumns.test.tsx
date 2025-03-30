import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import KanaPerformanceTable from '../../src/components/performanceTable/kanaPerformanceTable';
import '@testing-library/jest-dom';

describe('KanaPerformanceTable', () => {
  const mockPerformanceData = [
    { hiragana: 'あ', katakana: 'ア', romanji: 'a', accuracy: 90, total_answer: 10 },
    { hiragana: 'い', katakana: 'イ', romanji: 'i', accuracy: 80, total_answer: 5 },
  ];

  const columns = [
    { key: 'kana', header: 'Kana' },
    { key: 'accuracy', header: 'Accuracy' },
    { key: 'total_answer', header: 'Total Answer' },
  ];

    // Add this at the beginning of the test file, after the imports
  const scrollIntoViewMock = vi.fn();

  beforeEach(() => {
    // Reset the mock before each test
    scrollIntoViewMock.mockClear();

    // Mock the scrollIntoView method
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: scrollIntoViewMock,
      configurable: true,
    });
  });


  it('displays correct columns for hiragana', () => {
    render(
      <KanaPerformanceTable
        performanceData={mockPerformanceData}
        columns={columns}
        title="Hiragana Performance"
        kanaType="hiragana"
      />
    );

    fireEvent.click(screen.getByText('Show Performance Table'));

    // Check for column headers
    expect(screen.getByText('Kana')).toBeInTheDocument();
    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    expect(screen.getByText('Total Answer')).toBeInTheDocument();

    // Check for hiragana characters in the 'Kana' column
    expect(screen.getByText('あ')).toBeInTheDocument();
    expect(screen.getByText('い')).toBeInTheDocument();
  });

  it('displays correct columns for katakana', () => {
    render(
      <KanaPerformanceTable
        performanceData={mockPerformanceData}
        columns={columns}
        title="Katakana Performance"
        kanaType="katakana"
      />
    );

    fireEvent.click(screen.getByText('Show Performance Table'));

    // Check for column headers
    expect(screen.getByText('Kana')).toBeInTheDocument();
    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    expect(screen.getByText('Total Answer')).toBeInTheDocument();

    // Check for katakana characters in the 'Kana' column
    expect(screen.getByText('ア')).toBeInTheDocument();
    expect(screen.getByText('イ')).toBeInTheDocument();
  });

  it('displays correct data in columns', () => {
    render(
      <KanaPerformanceTable
        performanceData={mockPerformanceData}
        columns={columns}
        title="Kana Performance"
        kanaType="hiragana"
      />
    );

    fireEvent.click(screen.getByText('Show Performance Table'));

    // Check for accuracy values
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();

    // Check for total answer values
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});