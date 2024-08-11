import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
  it('renders Home page and finds the title', () => {
    render(<App />);
    expect(screen.getByText(/Japanese Kana Flashcard App/i)).not.toBeNull();
  });

  it('renders Home page and finds the practice katakana button', () => {
    render(<App />);
    expect(screen.getByText(/Practice Katakana/i)).not.toBeNull();
  });

  it('renders Home page and finds the practice hiragana button', () => {
    render(<App />);
    expect(screen.getByText(/Practice Hiragana/i)).not.toBeNull();
  });
});
