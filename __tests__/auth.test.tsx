import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Home from '../app/page';

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock the next-auth/react module
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  SessionProvider: ({ children }) => children,
  signOut: vi.fn(),
}));

describe('Authentication Flow', () => {
  const mockRouter = {
    replace: vi.fn(),
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });
  
  test('redirects to login when unauthenticated', async () => {
    (useSession as any).mockReturnValue({
      status: 'unauthenticated',
    });
    
    render(<Home />);
    
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    });
  });
  
  test('shows loading state while session is loading', () => {
    (useSession as any).mockReturnValue({
      status: 'loading',
    });
    
    render(<Home />);
    
    expect(screen.getByText('Loading...')).toBeDefined();
  });
  
  test('shows content when authenticated', () => {
    (useSession as any).mockReturnValue({
      status: 'authenticated',
      data: { user: { name: 'Test User' } },
    });
    
    render(<Home />);
    
    expect(screen.getByText('Japanese Kana Flashcard App')).toBeDefined();
    expect(screen.getByText('Hiragana Practice')).toBeDefined();
    expect(screen.getByText('Katakana Practice')).toBeDefined();
  });
  
  test('sign out button calls signOut function', () => {
    (useSession as any).mockReturnValue({
      status: 'authenticated',
      data: { user: { name: 'Test User' } },
    });
    
    render(<Home />);
    
    // Get all matching buttons and use the first one
    const signOutButtons = screen.getAllByTestId('main-sign-out-button');
    signOutButtons[0].click();
    
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});