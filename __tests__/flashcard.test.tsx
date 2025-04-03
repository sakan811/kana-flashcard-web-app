import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Flashcard from '../components/Flashcard';
import { useFlashcard } from '../components/FlashcardProvider';

// Keep mocks for dependencies, not for the component under test
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    status: 'authenticated',
    data: { user: { name: 'Test User' } },
  })),
}));

// Mock the FlashcardProvider hook
vi.mock('../components/FlashcardProvider', () => ({
  useFlashcard: vi.fn(),
}));

describe('Flashcard Component', () => {
  // Common test setup
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders loading state', () => {
    // Mock loading state
    (useFlashcard as any).mockReturnValue({
      currentKana: null,
      loadingKana: true,
      submitAnswer: vi.fn(),
      result: null,
      nextCard: vi.fn(),
    });

    render(<Flashcard />);
    
    // Check for loading spinner
    expect(screen.getByRole('status')).toBeDefined();
    expect(screen.getByRole('status').classList.contains('animate-spin')).toBe(true);
  });

  test('renders empty state when no flashcards are available', () => {
    // Mock empty state
    (useFlashcard as any).mockReturnValue({
      currentKana: null,
      loadingKana: false,
      submitAnswer: vi.fn(),
      result: null,
      nextCard: vi.fn(),
    });

    render(<Flashcard />);
    
    expect(screen.getByText('No flashcards available.')).toBeDefined();
  });

  test('renders flashcard with character correctly', () => {
    // Mock state with a kana character
    (useFlashcard as any).mockReturnValue({
      currentKana: {
        id: '1',
        character: 'あ',
        romaji: 'a',
        accuracy: 0.7,
      },
      loadingKana: false,
      submitAnswer: vi.fn(),
      result: null,
      nextCard: vi.fn(),
    });

    render(<Flashcard />);
    
    expect(screen.getByText('あ')).toBeDefined();
    expect(screen.getByPlaceholderText('Type romaji equivalent...')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDefined();
  });

  test('handles answer submission correctly', async () => {
    // Create mock functions for testing interactions
    const submitAnswerMock = vi.fn();
    
    (useFlashcard as any).mockReturnValue({
      currentKana: {
        id: '1',
        character: 'あ',
        romaji: 'a',
        accuracy: 0.7,
      },
      loadingKana: false,
      submitAnswer: submitAnswerMock,
      result: null,
      nextCard: vi.fn(),
    });

    render(<Flashcard />);
    
    // Find the input and submit button
    const input = screen.getAllByPlaceholderText('Type romaji equivalent...');
    const submitButton = screen.getAllByRole('button', { name: 'Submit' });
    
    // Type an answer and submit
    await userEvent.type(input[0], 'a');
    fireEvent.click(submitButton[0]);
    
    // Submit button should be in submitting state after click
    expect(submitButton[0].textContent).toContain('Submitting');
    
    // Verify the submitAnswer function was called with the correct value
    expect(submitAnswerMock).toHaveBeenCalledWith('a');
  });

  test('displays correct answer result', () => {
    (useFlashcard as any).mockReturnValue({
      currentKana: {
        id: '1',
        character: 'あ',
        romaji: 'a',
        accuracy: 0.7,
      },
      loadingKana: false,
      submitAnswer: vi.fn(),
      result: 'correct',
      nextCard: vi.fn(),
    });

    render(<Flashcard />);
    
    // Check for correct result message
    expect(screen.getByText('Correct!')).toBeDefined();
    expect(screen.getByText(/The correct answer is:/)).toBeDefined();
    expect(screen.getAllByText('a', { exact: false })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Next Card' })).toBeDefined();
  });

  test('displays incorrect answer result', () => {
    (useFlashcard as any).mockReturnValue({
      currentKana: {
        id: '1',
        character: 'あ',
        romaji: 'a',
        accuracy: 0.7,
      },
      loadingKana: false,
      submitAnswer: vi.fn(),
      result: 'incorrect',
      nextCard: vi.fn(),
    });

    render(<Flashcard />);
    
    // Check for incorrect result message
    expect(screen.getByText('Incorrect!')).toBeDefined();
    expect(screen.getAllByText(/The correct answer is:/)).toBeDefined();
    expect(screen.getAllByText('a', { exact: false })).toBeDefined();
  });

  test('advances to next card when button clicked after result', async () => {
    const nextCardMock = vi.fn();
    
    (useFlashcard as any).mockReturnValue({
      currentKana: {
        id: '1',
        character: 'あ',
        romaji: 'a',
        accuracy: 0.7,
      },
      loadingKana: false,
      submitAnswer: vi.fn(),
      result: 'correct',
      nextCard: nextCardMock,
    });

    render(<Flashcard />);
    
    // Click the Next Card button
    const nextButton = screen.getAllByRole('button', { name: 'Next Card' });
    fireEvent.click(nextButton[2]);
    
    // Verify nextCard was called
    expect(nextCardMock).toHaveBeenCalled();
  });

  test('handles keyboard navigation with Enter key', () => {
    // Setup spy BEFORE rendering
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const nextCardMock = vi.fn();
    
    (useFlashcard as any).mockReturnValue({
      currentKana: {
        id: '1',
        character: 'あ',
        romaji: 'a',
        accuracy: 0.7,
      },
      loadingKana: false,
      submitAnswer: vi.fn(),
      result: 'correct',
      nextCard: nextCardMock,
    });

    render(<Flashcard />);
    
    // Verify the event listener was registered
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    // Get the registered handler
    const keydownHandler = addEventListenerSpy.mock.calls.find(
      call => call[0] === 'keydown'
    )?.[1] as EventListener;
    
    // Simulate Enter key press
    if (keydownHandler) {
      const mockKeydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      keydownHandler(mockKeydownEvent);
      
      // Verify nextCard was called
      expect(nextCardMock).toHaveBeenCalled();
    } else {
      // Fail the test if we couldn't find the handler
      throw new Error('Keydown event handler not found');
    }
    
    // Cleanup
    vi.restoreAllMocks();
  });
});