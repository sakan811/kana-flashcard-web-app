import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RandomKana from "../../src/components/showKana";
import React from 'react';
import { vi, expect, it} from 'vitest'
import * as utilsFunc from '../../src/components/funcs/utilsFunc';
import * as showKanaFunc from '../../src/components/funcs/showKanaFunc';
import '@testing-library/jest-dom';


it('should choose the correct kana set based on URL parameter', () => {
  const mockHiraganaList = [{ hiragana: 'あ', romanji: 'a', weight: 1 }];
  const mockKatakanaList = [{ katakana: 'ア', romanji: 'a', weight: 1 }];

  vi.spyOn(utilsFunc, 'getHiraganaList').mockReturnValue(mockHiraganaList);
  vi.spyOn(utilsFunc, 'getKatakanaList').mockReturnValue(mockKatakanaList);
  vi.spyOn(showKanaFunc, 'initializeKanaPerformanceData').mockReturnValue([]);

  const { rerender } = render(
    <MemoryRouter initialEntries={['/hiragana']}>
      <Routes>
        <Route path="/:kanaType" element={<RandomKana />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Hiragana Flashcard')).toBeInTheDocument();
  expect(screen.getByText('あ')).toBeInTheDocument();

  rerender(undefined);
  rerender(
    <MemoryRouter initialEntries={['/katakana']}>
      <Routes>
        <Route path="/:kanaType" element={<RandomKana />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Katakana Flashcard')).toBeInTheDocument();
  expect(screen.getByText('ア')).toBeInTheDocument();
});

it('should choose default kana set when URL parameter is missing', () => {
  // Mocking dependencies
  const mockUseNavigate = vi.fn();
  const mockSetItem = vi.fn();
  const mockGetItem = vi.fn().mockReturnValue(null);
  const mockRandomCharacter = vi.fn().mockReturnValue({ hiragana: 'あ', romanji: 'a' });

  vi.spyOn(window.sessionStorage.__proto__, 'setItem').mockImplementation(mockSetItem);
  vi.spyOn(window.sessionStorage.__proto__, 'getItem').mockImplementation(mockGetItem);
  vi.spyOn(utilsFunc, 'getRandomCharacter').mockImplementation(mockRandomCharacter);

  render(
    <MemoryRouter> {/* Wrap the component in MemoryRouter */}
      <RandomKana />
    </MemoryRouter>
  );

  expect(mockUseNavigate).not.toHaveBeenCalled();
  expect(mockSetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockRandomCharacter).toHaveBeenCalled();
});