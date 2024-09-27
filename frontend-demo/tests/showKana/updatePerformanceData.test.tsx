import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {vi, describe, test, expect, beforeEach} from 'vitest';
import RandomKana from "../../src/components/showKana";

// Mock functions for utils
vi.mock('../../src/components/funcs/utilsFunc', () => ({
  getHiraganaList: vi.fn(() => [{ hiragana: 'あ', romanji: 'a' }, { hiragana: 'い', romanji: 'i' }]),
  getKatakanaList: vi.fn(() => [{ katakana: 'ア', romanji: 'a' }, { katakana: 'イ', romanji: 'i' }]),
  getRandomCharacter: vi.fn((kanaList) => kanaList[0]),  // Always return first character for deterministic test
}));

// Mock sessionStorage
vi.stubGlobal('sessionStorage', {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
});


describe('RandomKana Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/hiragana']}>
        <Routes>
          <Route path="/:kanaType" element={<RandomKana />} />
        </Routes>
      </MemoryRouter>
    );
  });

  test('Total answer count is incremented correctly', () => {
    const input = screen.getByPlaceholderText('Type here...');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'a' } }); // Correct answer
    fireEvent.click(submitButton);

    // Expect performance data to be updated in sessionStorage
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'hiragana-performance',
      expect.stringContaining('"total_answer":1') // Should increment total answer
    );
  });

  test('Correct answer count is incremented if input matches romanji', () => {
    const input = screen.getByPlaceholderText('Type here...');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'a' } }); // Correct answer
    fireEvent.click(submitButton);

    // Check that correct_answer is incremented in sessionStorage
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'hiragana-performance',
      expect.stringContaining('"correct_answer":1') // Should increment correct answer
    );
  });

  test('Accuracy is recalculated correctly', () => {
    const input = screen.getByPlaceholderText('Type here...');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'a' } }); // Correct answer
    fireEvent.click(submitButton);

    // Check that accuracy is calculated as 100% in sessionStorage
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'hiragana-performance',
      expect.stringContaining('"accuracy":100') // Correct answer means 100% accuracy
    );

    fireEvent.change(input, { target: { value: 'b' } }); // Incorrect answer
    fireEvent.click(submitButton);

    // Check that accuracy is recalculated as 50% after one wrong answer
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'hiragana-performance',
      expect.stringContaining('"accuracy":50') // 1 correct out of 2 total
    );
  });

  test('Updated performance data is correctly set in the state', () => {
    const input = screen.getByPlaceholderText('Type here...');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(submitButton);

    // Check that performance data is correctly updated in sessionStorage
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'hiragana-performance',
      expect.any(String) // It should have been updated with a stringified version of the new state
    );
  });
});
