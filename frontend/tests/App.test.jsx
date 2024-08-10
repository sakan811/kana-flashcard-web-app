import React from 'react';
import { render, screen } from '@testing-library/react';
import App from "../src/App";

test('renders Home page and find the title', () => {
  render(<App />);
  expect(screen.getByText(/Japanese Kana Flashcard App/i)).toBeInTheDocument();
});

test('renders Home page and find the practice katakana button', () => {
  render(<App />);
  expect(screen.getByText(/Practice Katakana/i)).toBeInTheDocument();
});

test('renders Home page and find the practice hiragana button', () => {
  render(<App />);
  expect(screen.getByText(/Practice Hiragana/i)).toBeInTheDocument();
});
