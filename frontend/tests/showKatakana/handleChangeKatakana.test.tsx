import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import RandomKana from "../../src/components/showKana";

// Mock the react-router-dom useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('RandomKatakana handleChange', () => {
  test('updates input value on change', async () => {
    render(<RandomKana />);

    const input = screen.getByPlaceholderText('Type here...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'ka' } });

    expect(input.value).toBe('ka');
  });
});