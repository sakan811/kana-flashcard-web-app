/**
 * HomeClient Component Tests
 * Tests for the client-side home page component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import HomeClient from '../../app/HomeClient';

// Mock next-auth
vi.mock('next-auth/react');
const mockUseSession = vi.mocked(useSession);

// Mock Header component
vi.mock('../../components/Header', () => ({
  default: ({ activeTab, setActiveTab }: any) => (
    <div data-testid="header">
      Header - Active: {activeTab}
    </div>
  ),
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ href, children, className, ...props }: any) => (
    <a href={href} className={className} data-testid={`link-${href.replace('/', '') || 'home'}`} {...props}>
      {children}
    </a>
  ),
}));

describe('HomeClient Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: vi.fn(),
      });

      render(<HomeClient />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('generic')).toHaveClass('animate-spin');
    });
  });

  describe('Unauthenticated State', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: vi.fn(),
      });
    });

    it('should render welcome message for unauthenticated users', () => {
      render(<HomeClient />);

      expect(screen.getByText('🌸 SakuMari 🌸')).toBeInTheDocument();
      expect(screen.getByText('Japanese Kana Flashcard App')).toBeInTheDocument();
      expect(screen.getByText('Master Hiragana and Katakana with interactive practice')).toBeInTheDocument();
    });

    it('should show welcome card with sign-in instructions', () => {
      render(<HomeClient />);

      expect(screen.getByText('Welcome to SakuMari!')).toBeInTheDocument();
      expect(screen.getByText(/Sign in with your Google account to start practicing/)).toBeInTheDocument();
      expect(screen.getByText(/Click "Sign In with Google" in the top navigation/)).toBeInTheDocument();
    });

    it('should not show practice cards when unauthenticated', () => {
      render(<HomeClient />);

      expect(screen.queryByTestId('link-hiragana')).not.toBeInTheDocument();
      expect(screen.queryByTestId('link-katakana')).not.toBeInTheDocument();
      expect(screen.queryByTestId('link-dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
        update: vi.fn(),
      });
    });

    it('should render practice cards for authenticated users', () => {
      render(<HomeClient />);

      expect(screen.getByTestId('link-hiragana')).toBeInTheDocument();
      expect(screen.getByTestId('link-katakana')).toBeInTheDocument();
      expect(screen.getByTestId('link-dashboard')).toBeInTheDocument();
    });

    it('should show Hiragana practice card with correct content', () => {
      render(<HomeClient />);

      const hiraganaCard = screen.getByTestId('link-hiragana');
      expect(hiraganaCard).toHaveAttribute('href', '/hiragana');
      expect(screen.getByText('ひらがな Hiragana Practice')).toBeInTheDocument();
      expect(screen.getByText('あいう')).toBeInTheDocument();
      expect(screen.getByText('Practice the Hiragana characters')).toBeInTheDocument();
      expect(screen.getByText('Start Learning →')).toBeInTheDocument();
    });

    it('should show Katakana practice card with correct content', () => {
      render(<HomeClient />);

      const katakanaCard = screen.getByTestId('link-katakana');
      expect(katakanaCard).toHaveAttribute('href', '/katakana');
      expect(screen.getByText('カタカナ Katakana Practice')).toBeInTheDocument();
      expect(screen.getByText('アイウ')).toBeInTheDocument();
      expect(screen.getByText('Practice the Katakana characters')).toBeInTheDocument();
    });

    it('should show dashboard link with correct content', () => {
      render(<HomeClient />);

      const dashboardLink = screen.getByTestId('link-dashboard');
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
      expect(screen.getByText('📊 View Your Progress')).toBeInTheDocument();
    });

    it('should not show welcome card when authenticated', () => {
      render(<HomeClient />);

      expect(screen.queryByText('Welcome to SakuMari!')).not.toBeInTheDocument();
      expect(screen.queryByText(/Sign in with your Google account/)).not.toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
        update: vi.fn(),
      });
    });

    it('should have proper CSS classes for styling', () => {
      render(<HomeClient />);

      const container = screen.getByRole('generic');
      expect(container).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-[#fad182]', 'via-[#f5c55a]', 'to-[#fad182]');
    });

    it('should render header with correct props', () => {
      render(<HomeClient />);

      expect(screen.getByTestId('header')).toHaveTextContent('Header - Active: flashcards');
    });

    it('should have responsive grid layout for practice cards', () => {
      render(<HomeClient />);

      const grid = screen.getByTestId('link-hiragana').parentElement;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
        update: vi.fn(),
      });
    });

    it('should have proper heading hierarchy', () => {
      render(<HomeClient />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('🌸 SakuMari 🌸');

      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s).toHaveLength(3); // Main subtitle + 2 practice card headings
    });

    it('should have accessible link texts', () => {
      render(<HomeClient />);

      expect(screen.getByRole('link', { name: /ひらがな Hiragana Practice/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /カタカナ Katakana Practice/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /📊 View Your Progress/i })).toBeInTheDocument();
    });

    it('should have proper color contrast classes', () => {
      render(<HomeClient />);

      const title = screen.getByText('🌸 SakuMari 🌸');
      expect(title).toHaveClass('text-[#403933]');
    });
  });
});