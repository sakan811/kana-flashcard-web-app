import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, expect, vi, test } from 'vitest';
import * as showKanaFunc from '../../src/components/funcs/showKanaFunc';
import * as utilsFunc from '../../src/components/funcs/utilsFunc';
import RandomKana from "../../src/components/showKana";

// Mock the react-router-dom useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock the imported functions
vi.mock('./funcs/utilsFunc', () => ({
  getRandomCharacter: vi.fn(() => ({ katakana: 'ア', romanji: 'a', weight: 1 })),
  getHiraganaList: vi.fn(() => [{ katakana: 'ア', romanji: 'a', weight: 1 }])
}));
vi.mock('./funcs/showKanaFunc', () => ({
  updateKanaWeight: vi.fn(() => [{ katakana: 'ア', romanji: 'a', weight: 1 }]),
  submitAnswer: vi.fn()
}));

// Mock KanaPerformanceTable
vi.mock('../src/components/kanaPerformanceTable', () => ({
  default: () => <div>Mocked KanaPerformanceTable</div>
}));

// Mock button and Callbacks
const mockSubmitAnswer = vi.fn();
vi.spyOn(showKanaFunc, 'submitAnswer').mockImplementation(mockSubmitAnswer);
vi.spyOn(showKanaFunc, 'updateKanaWeight').mockResolvedValue([{ katakana: 'ア', romanji: 'a', weight: 1 }]);
vi.spyOn(utilsFunc, 'getRandomCharacter').mockReturnValue({ katakana: 'ア', romanji: 'a', weight: 1 });


describe('RandomKatakana', () => {
  test('renders RandomKatakana component', async () => {
    await act(async () => {
      render(<RandomKana />);
    });
    expect(screen.getByText('Katakana Flashcard')).not.toBeNull();
  });

  test('updates katakana and performance data after submission', async () => {
    await act(async () => {
      render(<RandomKana />);
    });

    const input = screen.getByLabelText('Enter Romanji:');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(showKanaFunc.updateKanaWeight).toHaveBeenCalled();
      expect(utilsFunc.getRandomCharacter).toHaveBeenCalled();
    });
  });
});