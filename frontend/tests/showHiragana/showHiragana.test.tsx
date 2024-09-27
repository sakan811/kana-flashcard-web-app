import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RandomHiragana from '../../src/components/showHiragana';
import * as showKanaFunc from '../../src/components/funcs/showKanaFunc';
import * as utilsFunc from '../../src/components/funcs/utilsFunc';

// Mock the react-router-dom useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock the imported functions
vi.mock('../src/components/funcs/utilsFunc', () => ({
  getRandomCharacter: vi.fn(() => ({ hiragana: 'あ', romanji: 'a', weight: 1 })),
  getHiraganaList: vi.fn(() => [{ hiragana: 'あ', romanji: 'a', weight: 1 }])
}));
vi.mock('../src/components/funcs/showKanaFunc', () => ({
  updateKanaWeight: vi.fn(() => [{ hiragana: 'あ', romanji: 'a', weight: 1 }]),
  submitAnswer: vi.fn()
}));

// Mock KanaPerformanceTable
vi.mock('../src/components/kanaPerformanceTable', () => ({
  default: () => <div>Mocked KanaPerformanceTable</div>
}));

// Mock button and Callbacks
vi.spyOn(showKanaFunc, 'submitAnswer').mockResolvedValue(undefined);
vi.spyOn(showKanaFunc, 'updateKanaWeight').mockResolvedValue([{ hiragana: 'あ', romanji: 'a', weight: 1 }]);
vi.spyOn(utilsFunc, 'getRandomCharacter').mockReturnValue({ hiragana: 'あ', romanji: 'a', weight: 1 });

describe('RandomHiragana', () => {
  it('renders RandomHiragana component', async () => {
    render(<RandomHiragana />);
    expect(screen.getByText('Hiragana Flashcard')).not.toBeNull();
  });

  it('updates Hiragana and performance data after submission', async () => {
    render(<RandomHiragana />);

    const input = screen.getByLabelText('Enter Romanji:');
    fireEvent.change(input, { target: { value: 'a' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(showKanaFunc.updateKanaWeight).toHaveBeenCalled();
      expect(utilsFunc.getRandomCharacter).toHaveBeenCalled();
    });
  });
});
