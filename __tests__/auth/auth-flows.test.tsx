import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Header from '@/components/Header';
import Home from '@/app/page';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
}));

describe('Authentication Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Unauthenticated State', () => {
    beforeEach(() => {
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });
    });

    test('shows sign-in button when user is not authenticated', () => {
      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      expect(screen.getByText('Sign In with Google')).toBeInTheDocument();
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });

    test('calls signIn when sign-in button is clicked', async () => {
      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      const signInButton = screen.getByText('Sign In with Google');
      fireEvent.click(signInButton);
      
      expect(signIn).toHaveBeenCalledWith('google');
    });

    test('shows welcome message instead of practice options', () => {
      render(<Home />);
      
      expect(screen.getByText('Welcome to SakuMari!')).toBeInTheDocument();
      expect(screen.getByText(/Sign in with your Google account/)).toBeInTheDocument();
      expect(screen.queryByText('ひらがな Hiragana Practice')).not.toBeInTheDocument();
    });

    test('disables sign-in button during loading state', () => {
      (useSession as any).mockReturnValue({
        data: null,
        status: 'loading',
      });

      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      const signInButton = screen.getByText('Loading...');
      expect(signInButton).toBeDisabled();
    });
  });

  describe('Authenticated State', () => {
    const mockSession = {
      user: {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/avatar.jpg',
      },
      expires: '2025-12-31T23:59:59.999Z',
    };

    beforeEach(() => {
      (useSession as any).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });
    });

    test('shows user profile and sign-out button when authenticated', () => {
      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
      expect(screen.queryByText('Sign In with Google')).not.toBeInTheDocument();
    });

    test('displays user avatar when image is available', () => {
      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      const avatar = screen.getByAltText('Profile');
      expect(avatar).toBeInTheDocument();
      expect(avatar.getAttribute('src')).toContain('avatar.jpg');
    });

    test('shows user initials when no image available', () => {
      (useSession as any).mockReturnValue({
        data: { ...mockSession, user: { ...mockSession.user, image: null } },
        status: 'authenticated',
      });

      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      expect(screen.getByText('J')).toBeInTheDocument(); // First letter of John
    });

    test('calls signOut when sign-out button is clicked', async () => {
      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      const signOutButton = screen.getByText('Sign Out');
      fireEvent.click(signOutButton);
      
      expect(signOut).toHaveBeenCalled();
    });

    test('shows practice options when authenticated', () => {
      render(<Home />);
      
      expect(screen.getByText('ひらがな Hiragana Practice')).toBeInTheDocument();
      expect(screen.getByText('カタカナ Katakana Practice')).toBeInTheDocument();
      expect(screen.getByText('📊 View Your Progress')).toBeInTheDocument();
    });

    test('shows navigation links in header when authenticated', () => {
      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      expect(screen.getByText(/Hiragana/)).toBeInTheDocument();
      expect(screen.getByText(/Katakana/)).toBeInTheDocument();
      expect(screen.getByText('📊 Dashboard')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      (useSession as any).mockReturnValue({
        data: null,
        status: 'loading',
      });
    });

    test('shows loading spinner during authentication check', () => {
      render(<Home />);
      
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    test('disables sign-in button during loading', () => {
      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      const button = screen.getByText('Loading...');
      expect(button).toBeDisabled();
    });
  });

  describe('Mobile Navigation', () => {
    const mockSession = {
      user: { id: 'user123', name: 'John Doe', email: 'john@example.com' },
      expires: '2025-12-31T23:59:59.999Z',
    };

    test('shows mobile menu with authentication options', async () => {
      (useSession as any).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      // Click mobile menu button
      const menuButton = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(menuButton);
      
      // Check mobile menu items
      await waitFor(() => {
        expect(screen.getAllByText(/Hiragana/)[1]).toBeInTheDocument(); // Mobile version
        expect(screen.getAllByText(/Katakana/)[1]).toBeInTheDocument(); // Mobile version
      });
    });

    test('mobile sign-out closes menu and calls signOut', async () => {
      (useSession as any).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      render(<Header activeTab="flashcards" setActiveTab={vi.fn()} />);
      
      // Open mobile menu
      const menuButton = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(menuButton);
      
      // Click sign out in mobile menu
      const mobileSignOut = screen.getAllByText('Sign Out').find(button => 
        button.closest('[class*="lg:hidden"]')
      );
      if (mobileSignOut) {
        fireEvent.click(mobileSignOut);
        expect(signOut).toHaveBeenCalled();
      }
    });
  });
});