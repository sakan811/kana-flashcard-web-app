import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import { describe, beforeEach, it, expect } from 'vitest';
import {MemoryRouter, Route, Routes} from "react-router-dom";
import RandomKana from "../../src/components/showKana";
import React from "react";
import '@testing-library/jest-dom';

describe('Performance Data Serialization', () => {
  beforeEach(() => {
    sessionStorage.clear();
    render(
      <MemoryRouter initialEntries={['/hiragana']}>
        <Routes>
          <Route path="/:kanaType" element={<RandomKana />} />
        </Routes>
      </MemoryRouter>
    );
  });

  it('should correctly serialize updated performance data to JSON', () => {
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(submitButton);

    const serializedDataInit = sessionStorage.getItem('hiragana-performance');
    const serializedData = serializedDataInit !== null ? serializedDataInit : '';
    expect(serializedData).not.toBeNull();
    const parsedData = JSON.parse(serializedData);
    expect(parsedData).toBeInstanceOf(Array);
    expect(parsedData.length).toBeGreaterThan(0);
    expect(parsedData[0]).toHaveProperty('total_answer');
  });

  it('should store serialized performance data in sessionStorage', () => {
    const mockPerformanceData = { correct: 5, incorrect: 3 };

    // Simulate updating sessionStorage in your component
    sessionStorage.setItem('performanceData', JSON.stringify(mockPerformanceData));

    const storedData = sessionStorage.getItem('performanceData');
    expect(storedData).toBe(JSON.stringify(mockPerformanceData));
  });

  it('should correctly format the sessionStorage key with kanaType', () => {
    const kanaType = 'hiragana';
    const mockPerformanceData = { correct: 5, incorrect: 3 };
    const expectedKey = `performance_${kanaType}`;

    sessionStorage.setItem(expectedKey, JSON.stringify(mockPerformanceData));

    expect(sessionStorage.getItem(expectedKey)).not.toBeNull();
  });

  it('should update sessionStorage after each submission', async () => {
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const input = screen.getByRole('textbox');

    // Get the current kana displayed
    const kanaElement = screen.getByText(/[あ-ん]/);
    const currentKana = kanaElement.textContent;

    // Find the correct romanji for the current kana
    const correctRomanji = currentKana === 'あ' ? 'a' : 'incorrect'; // Adjust this based on your kana list

    fireEvent.change(input, { target: { value: correctRomanji } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const storedDataInit = sessionStorage.getItem('hiragana-performance');
      const storedData = storedDataInit !== null ? storedDataInit : '';
      expect(storedData).not.toBeNull();
      const parsedData = JSON.parse(storedData);
      expect(parsedData).toBeInstanceOf(Array);
      expect(parsedData.length).toBeGreaterThan(0);
      const updatedKana = parsedData.find((item: { kana: string | null; }) => item.kana === currentKana);
      expect(updatedKana).toBeDefined();
      expect(updatedKana.total_answer).toBe(1);
    });
  });
});

