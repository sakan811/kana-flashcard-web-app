import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RandomKatakana from '../src/components/showKatakana';
import * as showKanaFunc from '../src/components/funcs/showKanaFunc';
import * as utilsFunc from '../src/components/funcs/utilsFunc';

// Mock the react-router-dom useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock the imported functions
jest.mock('../src/components/funcs/showKanaFunc', () => ({
  updateKanaWeight: jest.fn(),
  getKanaPerformance: jest.fn(),
  submitAnswer: jest.fn(),
}));

jest.mock('../src/components/funcs/utilsFunc', () => ({
  getRandomCharacter: jest.fn(),
}));

// Mock KanaPerformanceTable component
jest.mock('../src/components/kanaPerformanceTable', () => {
  return function DummyKanaPerformanceTable() {
    return <div>Mocked KanaPerformanceTable</div>;
  };
});

describe('RandomKatakana', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    utilsFunc.getRandomCharacter.mockReturnValue({ katakana: 'ア', romanji: 'a', weight: 1 });
    showKanaFunc.submitAnswer.mockResolvedValue();
    showKanaFunc.updateKanaWeight.mockResolvedValue([{ katakana: 'イ', romanji: 'i', weight: 1 }]);
    showKanaFunc.getKanaPerformance.mockResolvedValue([]);
  });

  test('renders RandomKatakana component', async () => {
    await act(async () => {
      render(<RandomKatakana />);
    });
    expect(screen.getByText('Katakana Flashcard')).toBeInTheDocument();
  });

  test('submits correct answer', async () => {
    await act(async () => {
      render(<RandomKatakana />);
    });

    const input = screen.getByLabelText('Enter Romanji:');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(showKanaFunc.submitAnswer).toHaveBeenCalledWith('katakana', 'a', { katakana: 'ア', romanji: 'a', weight: 1 }, true);
      expect(screen.getByText('Correct!')).toBeInTheDocument();
    });
  });

  test('submits incorrect answer', async () => {
    await act(async () => {
      render(<RandomKatakana />);
    });

    const input = screen.getByLabelText('Enter Romanji:');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'i' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(showKanaFunc.submitAnswer).toHaveBeenCalledWith('katakana', 'i', { katakana: 'ア', romanji: 'a', weight: 1 }, false);
      const incorrectMsg = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' &&
               element.className === 'incorrectMsg' &&
               element.innerHTML.includes('Incorrect. It is <b>a</b>');
      });
      expect(incorrectMsg).toBeInTheDocument();
    });
  });

  test('updates katakana and performance data after submission', async () => {
    await act(async () => {
      render(<RandomKatakana />);
    });

    const input = screen.getByLabelText('Enter Romanji:');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(showKanaFunc.updateKanaWeight).toHaveBeenCalled();
      expect(showKanaFunc.getKanaPerformance).toHaveBeenCalled();
      expect(utilsFunc.getRandomCharacter).toHaveBeenCalled();
    });
  });

  test('handles submission error', async () => {
    showKanaFunc.submitAnswer.mockRejectedValue(new Error('Submission failed'));

    await act(async () => {
      render(<RandomKatakana />);
    });

    const input = screen.getByLabelText('Enter Romanji:');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(screen.getByText('Submission failed. Please try again.')).toBeInTheDocument();
    });
  });
});