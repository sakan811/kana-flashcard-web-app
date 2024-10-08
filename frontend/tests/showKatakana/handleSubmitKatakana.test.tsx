import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, expect, vi, test } from 'vitest';
import * as showKanaFunc from '../../src/components/funcs/showKanaFunc';
import * as utilsFunc from '../../src/components/funcs/utilsFunc';
import RandomKana from "../../src/components/showKana";
import {MemoryRouter, Route, Routes} from "react-router-dom";

// Mock the imported functions
vi.mock('../src/components/funcs/utilsFunc', () => ({
  getRandomCharacter: vi.fn(() => ({ katakana: 'ア', romanji: 'a', weight: 1 })),
  getKatakanaList: vi.fn(() => [{ katakana: 'ア', romanji: 'a', weight: 1 }])
}));
vi.mock('../src/components/funcs/utilsFunc', () => ({
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
  test('submits correct answer', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/katakana']}>
          <Routes>
            <Route path="/:kanaType" element={<RandomKana />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const input = screen.getByLabelText('Enter Romanji:');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(showKanaFunc.submitAnswer).toHaveBeenCalledWith('katakana', 'a', { katakana: 'ア', romanji: 'a', weight: 1 }, true);
      expect(screen.getByText('Correct!')).not.toBeNull();
    });
  });

  test('submits incorrect answer', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/katakana']}>
          <Routes>
            <Route path="/:kanaType" element={<RandomKana />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const input = screen.getByLabelText('Enter Romanji:');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'i' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(showKanaFunc.submitAnswer).toHaveBeenCalledWith('katakana', 'i', { katakana: 'ア', romanji: 'a', weight: 1 }, false);
      const incorrectMsg = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' &&
               element?.className === 'incorrectMsg' &&
               element?.innerHTML.includes('Incorrect. It is <b>a</b>');
      });
      expect(incorrectMsg).not.toBeNull();
    });
  });

  test('handles submission error', async () => {
    mockSubmitAnswer.mockRejectedValue(new Error('Submission failed'));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/katakana']}>
          <Routes>
            <Route path="/:kanaType" element={<RandomKana />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const input = screen.getByLabelText('Enter Romanji:');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(screen.getByText('Submission failed. Please try again.')).not.toBeNull();
    });
  });
});