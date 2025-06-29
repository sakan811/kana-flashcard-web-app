/**
 * SEO Integration Tests
 * Tests for SEO functionality integration across components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

// Import page components
import HomeClient from '../../app/HomeClient';
import HiraganaClient from '../../app/hiragana/HiraganaClient';
import KatakanaClient from '../../app/katakana/KatakanaClient';
import DashboardClient from '../../app/dashboard/DashboardClient';

// Mock next-auth
vi.mock('next-auth/react');
const mockUseSession = vi.mocked(useSession);

// Mock components
vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../components/FlashcardApp', () => ({
  default: ({ kanaType }: { kanaType: string }) => (
    <div data-testid="flashcard-app" data-kana-type={kanaType}>
      FlashcardApp - {kanaType}
    </div>
  ),
}));

vi.mock('../../components/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('SEO Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('Page Rendering with SEO Structure', () => {
    it('should render home page with proper semantic structure', () => {
      render(<HomeClient />);

      // Check for main heading
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('🌸 SakuMari 🌸');

      // Check for navigation links with proper text
      expect(screen.getByRole('link', { name: /hiragana practice/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /katakana practice/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view your progress/i })).toBeInTheDocument();
    });

    it('should render Hiragana page with proper content structure', () => {
      render(<HiraganaClient />);

      const flashcardApp = screen.getByTestId('flashcard-app');
      expect(flashcardApp).toHaveAttribute('data-kana-type', 'hiragana');
    });

    it('should render Katakana page with proper content structure', () => {
      render(<KatakanaClient />);

      const flashcardApp = screen.getByTestId('flashcard-app');
      expect(flashcardApp).toHaveAttribute('data-kana-type', 'katakana');
    });

    it('should render Dashboard page with proper content structure', () => {
      render(<DashboardClient />);

      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
  });

  describe('Content Quality for SEO', () => {
    it('should have descriptive link text for better SEO', () => {
      render(<HomeClient />);

      // Check that links have descriptive text, not just "click here"
      const hiraganaLink = screen.getByRole('link', { name: /hiragana practice/i });
      expect(hiraganaLink).toHaveTextContent(/practice.*hiragana.*characters/i);

      const katakanaLink = screen.getByRole('link', { name: /katakana practice/i });
      expect(katakanaLink).toHaveTextContent(/practice.*katakana.*characters/i);
    });

    it('should have proper heading hierarchy', () => {
      render(<HomeClient />);

      // Check heading levels are properly structured for SEO
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();

      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('should include Japanese characters for language-specific SEO', () => {
      render(<HomeClient />);

      // Check that actual Japanese characters are included for better language SEO
      expect(screen.getByText(/ひらがな/)).toBeInTheDocument(); // Hiragana
      expect(screen.getByText(/カタカナ/)).toBeInTheDocument(); // Katakana
      expect(screen.getByText('あいう')).toBeInTheDocument(); // Sample Hiragana
      expect(screen.getByText('アイウ')).toBeInTheDocument(); // Sample Katakana
    });
  });

  describe('User Experience and SEO Alignment', () => {
    it('should provide clear value proposition for SEO', () => {
      render(<HomeClient />);

      // Check for clear value proposition that aligns with meta descriptions
      expect(screen.getByText(/master hiragana and katakana/i)).toBeInTheDocument();
      expect(screen.getByText(/interactive practice/i)).toBeInTheDocument();
    });

    it('should have consistent navigation structure', () => {
      render(<HomeClient />);

      // Check navigation consistency for better user experience and SEO
      expect(screen.getByTestId('header')).toBeInTheDocument();
      
      // Verify navigation links are present
      const hiraganaLink = screen.getByRole('link', { name: /hiragana practice/i });
      const katakanaLink = screen.getByRole('link', { name: /katakana practice/i });
      const dashboardLink = screen.getByRole('link', { name: /view your progress/i });

      expect(hiraganaLink).toHaveAttribute('href', '/hiragana');
      expect(katakanaLink).toHaveAttribute('href', '/katakana');
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('Accessibility and SEO Alignment', () => {
    it('should have accessible content that also benefits SEO', () => {
      render(<HomeClient />);

      // Check for alt text equivalents in content structure
      const practiceCards = screen.getAllByRole('link');
      const contentfulCards = practiceCards.filter(card => 
        card.textContent && card.textContent.length > 10
      );
      
      expect(contentfulCards.length).toBeGreaterThan(0);
      
      // Each practice card should have descriptive content
      contentfulCards.forEach(card => {
        expect(card.textContent).toMatch(/(hiragana|katakana|practice|progress)/i);
      });
    });

    it('should use semantic HTML structure', () => {
      render(<HomeClient />);

      // Check for proper semantic structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
    });
  });

  describe('Component Integration', () => {
    it('should maintain component functionality after SEO separation', () => {
      // Test that all client components render without errors
      expect(() => render(<HomeClient />)).not.toThrow();
      expect(() => render(<HiraganaClient />)).not.toThrow();
      expect(() => render(<KatakanaClient />)).not.toThrow();
      expect(() => render(<DashboardClient />)).not.toThrow();
    });

    it('should pass correct props between server and client components', () => {
      // Hiragana client should get correct kana type
      const { unmount } = render(<HiraganaClient />);
      expect(screen.getByTestId('flashcard-app')).toHaveAttribute('data-kana-type', 'hiragana');
      unmount();

      // Katakana client should get correct kana type
      render(<KatakanaClient />);
      expect(screen.getByTestId('flashcard-app')).toHaveAttribute('data-kana-type', 'katakana');
    });
  });
});