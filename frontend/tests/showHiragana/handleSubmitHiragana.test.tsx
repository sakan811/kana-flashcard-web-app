import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as showKanaFunc from '../../src/components/funcs/showKanaFunc';
import * as utilsFunc from '../../src/components/funcs/utilsFunc';
import RandomKana from "../../src/components/showKana";
import {MemoryRouter, Route, Routes} from "react-router-dom";

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
  it('submits correct answer', async () => {
    render(
      <MemoryRouter initialEntries={['/hiragana']}>
        <Routes>
          <Route path="/:kanaType" element={<RandomKana />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByLabelText('Enter Romanji:');
    fireEvent.change(input, { target: { value: 'a' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(showKanaFunc.submitAnswer).toHaveBeenCalledWith(
        'hiragana',
        'a',
        { hiragana: 'あ', romanji: 'a', weight: 1 },
        true
      );
      expect(screen.getByText('Correct!')).not.toBeNull();
    });
  });

  it('submits incorrect answer', async () => {
    render(
      <MemoryRouter initialEntries={['/hiragana']}>
        <Routes>
          <Route path="/:kanaType" element={<RandomKana />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByLabelText('Enter Romanji:');
    fireEvent.change(input, { target: { value: 'i' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(showKanaFunc.submitAnswer).toHaveBeenCalledWith(
        'hiragana',
        'i',
        { hiragana: 'あ', romanji: 'a', weight: 1 },
        false
      );
      const incorrectMsg = screen.getByText((content, element) =>
        element?.tagName.toLowerCase() === 'p' &&
        element?.className === 'incorrectMsg' &&
        element?.innerHTML.includes('Incorrect. It is <b>a</b>')
      );
      expect(incorrectMsg).not.toBeNull();
    });
  });

  it('handles submission error', async () => {
    vi.spyOn(showKanaFunc, 'submitAnswer').mockRejectedValue(new Error('Submission failed'));

    render(
      <MemoryRouter initialEntries={['/hiragana']}>
        <Routes>
          <Route path="/:kanaType" element={<RandomKana />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByLabelText('Enter Romanji:');
    fireEvent.change(input, { target: { value: 'a' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Submission failed. Please try again.')).not.toBeNull();
    });
  });
});
