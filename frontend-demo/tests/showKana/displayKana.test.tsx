import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RandomKana from '../../src/components/showKana';
import { vi, it, expect } from 'vitest';
import * as utilsFunc from '../../src/components/funcs/utilsFunc';
import '@testing-library/jest-dom';
import React from 'react';

it('Hiragana character is displayed when kanaType is hiragana', () => {
  const mockHiraganaList = [{ hiragana: 'あ', romanji: 'a', weight: 1 }];
  vi.spyOn(utilsFunc, 'getHiraganaList').mockReturnValue(mockHiraganaList);

  render(
    <MemoryRouter initialEntries={['/hiragana']}>
      <Routes>
        <Route path="/:kanaType" element={<RandomKana />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Hiragana Flashcard')).toBeInTheDocument();
  expect(screen.getByText('あ')).toBeInTheDocument(); // Asserting Hiragana character
});

it('Katakana character is displayed when kanaType is katakana', () => {
  const mockKatakanaList = [{ katakana: 'ア', romanji: 'a', weight: 1 }];
  vi.spyOn(utilsFunc, 'getKatakanaList').mockReturnValue(mockKatakanaList);

  render(
    <MemoryRouter initialEntries={['/katakana']}>
      <Routes>
        <Route path="/:kanaType" element={<RandomKana />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Katakana Flashcard')).toBeInTheDocument();
  expect(screen.getByText('ア')).toBeInTheDocument(); // Asserting Katakana character
});

it('Character updates correctly after form submission', async () => {
  const mockHiraganaList = [
    { hiragana: 'あ', romanji: 'a', weight: 1 },
    { hiragana: 'い', romanji: 'i', weight: 1 },
  ];
  vi.spyOn(utilsFunc, 'getHiraganaList').mockReturnValue(mockHiraganaList);

  // Mock getRandomCharacter to return 'あ' first, and 'い' on the next call
  vi.spyOn(utilsFunc, 'getRandomCharacter')
    .mockReturnValueOnce(mockHiraganaList[0])  // First, return 'あ'
    .mockReturnValueOnce(mockHiraganaList[1]); // Then return 'い' after submit

  render(
    <MemoryRouter initialEntries={['/hiragana']}>
      <Routes>
        <Route path="/:kanaType" element={<RandomKana />} />
      </Routes>
    </MemoryRouter>
  );

  // Initial Hiragana character
  expect(screen.getByText('あ')).toBeInTheDocument();

  // Simulate typing 'a' in the input field
  const input = screen.getByPlaceholderText('Type here...');
  fireEvent.change(input, { target: { value: 'a' } });

  // Simulate form submission
  fireEvent.submit(screen.getByText('Submit'));

  // Wait for character update (e.g., 'あ' -> 'い')
  await waitFor(() => {
    expect(screen.getByText('い')).toBeInTheDocument(); // The character should change
  });
});

it('Character is displayed in a styled container', () => {
  const mockHiraganaList = [{ hiragana: 'あ', romanji: 'a', weight: 0 }];
  vi.spyOn(utilsFunc, 'getHiraganaList').mockReturnValue(mockHiraganaList);

  render(
    <MemoryRouter initialEntries={['/hiragana']}>
      <Routes>
        <Route path="/:kanaType" element={<RandomKana />} />
      </Routes>
    </MemoryRouter>
  );

  const kanaBox = screen.getByText('あ').closest('.kanaBox');
  expect(kanaBox).toBeInTheDocument(); // Assert that the kana character is within the styled container
});
