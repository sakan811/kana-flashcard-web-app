import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import RandomKana from "../../src/components/showKana";
import { MemoryRouter } from 'react-router-dom';

describe('RandomHiragana handleChange', () => {
  test('updates input value on change', async () => {
    render(
      <MemoryRouter> {/* Wrap the component with MemoryRouter */}
        <RandomKana />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Type here...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'ka' } });

    expect(input.value).toBe('ka');
  });
});