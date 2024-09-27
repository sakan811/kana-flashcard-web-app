import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RandomKana from "../../src/components/showKana";
import { vi, describe, beforeEach, test, expect } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

// Mock the entire module
vi.mock('../../src/components/funcs/utilsFunc', () => ({
  getHiraganaList: vi.fn(() => [
    { hiragana: 'あ', katakana: 'ア', romanji: 'a', weight: 0 },
  ]),
  getRandomCharacter: vi.fn(() => ({ hiragana: 'あ', katakana: 'ア', romanji: 'a', weight: 0 })),
}));

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

  test('Displays mocked kana and handles correct submission', async () => {
    // Check if the mocked kana is displayed
    expect(screen.getByText('あ')).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/type here.../i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Correct!')).toBeInTheDocument();
    });
  });

  test("Correct message content is 'Correct!'", async () => {
    const input = screen.getByPlaceholderText(/type here.../i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Correct!')).toBeInTheDocument();
    });
  });


  test('Correct message does not appear for incorrect submissions', async () => {
    const input = screen.getByPlaceholderText(/type here.../i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: 'b' } }); // Incorrect submission
    fireEvent.click(submitButton);

    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
  });
});