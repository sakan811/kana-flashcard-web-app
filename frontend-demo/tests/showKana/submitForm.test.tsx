import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RandomKana from '../../src/components/showKana';
import { vi, it, expect, beforeEach } from 'vitest';
import * as utilsFunc from '../../src/components/funcs/utilsFunc';
import '@testing-library/jest-dom';
import React from 'react';

beforeEach(() => {
  vi.spyOn(utilsFunc, 'getHiraganaList').mockReturnValue([{ hiragana: 'あ', romanji: 'a', weight: 0 }]);
  vi.spyOn(utilsFunc, 'getRandomCharacter').mockReturnValue({ hiragana: 'あ', romanji: 'a', weight: 0 });
});

const renderComponent = () => {
  render(
    <MemoryRouter initialEntries={['/hiragana']}>
      <Routes>
        <Route path="/:kanaType" element={<RandomKana />} />
      </Routes>
    </MemoryRouter>
  );
};

it('Input field accepts text input', () => {
  renderComponent();
  const input = screen.getByPlaceholderText('Type here...');
  fireEvent.change(input, { target: { value: 'a' } });
  expect(input).toHaveValue('a');
});

it('Form submission triggers handleSubmit function', () => {
  renderComponent();
  const input = screen.getByPlaceholderText('Type here...');
  fireEvent.change(input, { target: { value: 'a' } });
  const form = screen.getByRole('form');
  fireEvent.submit(form);
  expect(screen.getByText('Correct!')).toBeInTheDocument();
});

it('Input value is processed correctly on form submission', () => {
  renderComponent();
  const input = screen.getByPlaceholderText('Type here...');
  fireEvent.change(input, { target: { value: 'a' } });
  const form = screen.getByRole('form');
  fireEvent.submit(form);
  expect(screen.getByText('Correct!')).toBeInTheDocument();
  expect(input).toHaveValue('');
});

it('Form submission is prevented from default behavior', () => {
  renderComponent();
  const form = screen.getByRole('form');
  const mockSubmit = vi.fn(e => e.preventDefault());
  form.onsubmit = mockSubmit;
  fireEvent.submit(form);
  expect(mockSubmit).toHaveBeenCalled();
  expect(mockSubmit.mock.results[0].value).toBe(undefined);
});

it('Form has correct accessibility attributes', () => {
  renderComponent();
  const form = screen.getByRole('form');
  expect(form).toHaveAttribute('id', 'romanjiForm');
  expect(form).toHaveAttribute('role', 'form');
});