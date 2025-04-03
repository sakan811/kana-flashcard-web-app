import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Home from '../app/page';

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
}));

// Mock the next-auth/react module
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  SessionProvider: ({ children }) => children,
  signOut: vi.fn(),
}));

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    default: ({ children, href }) => {
      return <a href={href}>{children}</a>;
    }
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useSession as any).mockReturnValue({
      status: 'authenticated',
      data: { user: { name: 'Test User' } },
    });
  });

  test('renders all navigation cards', () => {
    render(<Home />);
    
    expect(screen.getByText('Japanese Kana Flashcard App')).toBeDefined();
    expect(screen.getByText('Hiragana Practice')).toBeDefined();
    expect(screen.getByText('Katakana Practice')).toBeDefined();
    expect(screen.getByText('View Your Progress')).toBeDefined();
  });
  
  test('contains correct navigation links', () => {
    render(<Home />);
    
    const hiraganaLink = screen.getAllByText('Hiragana Practice')[1].closest('a');
    const katakanaLink = screen.getAllByText('Katakana Practice')[1].closest('a');
    const progressLink = screen.getAllByText('View Your Progress')[1].closest('a');
    
    expect(hiraganaLink?.getAttribute('href')).toBe('/hiragana');
    expect(katakanaLink?.getAttribute('href')).toBe('/katakana');
    expect(progressLink?.getAttribute('href')).toBe('/dashboard');
  });
});