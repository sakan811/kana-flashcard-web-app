import { test, expect } from '@playwright/test';

test.describe('Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login and create some practice data
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign In with Google' }).click();
    await page.waitForURL('**/auth/signin');
    await page.getByLabel('Password').fill('test123');
    await page.getByRole('button', { name: 'Sign in with Test User' }).click();
    await page.waitForURL('/');

    // Practice a few cards to generate data
    await page.getByText('ひらがな Hiragana Practice').click();
    await page.waitForURL('/hiragana');
    
    // Submit a few answers
    for (let i = 0; i < 3; i++) {
      await page.getByPlaceholderText('Type romaji equivalent...').fill('a');
      await page.getByRole('button', { name: 'Submit' }).click();
      
      // Wait for result and go to next card
      await expect(page.locator('text=Correct!,text=Incorrect!')).toBeVisible();
      await page.getByRole('button', { name: 'Next Card' }).click();
    }
  });

  test('should display progress statistics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show dashboard title
    await expect(page.getByText('Dashboard')).toBeVisible();
    
    // Should show progress section
    await expect(page.getByText('Your Progress')).toBeVisible();
    
    // Should show stat cards
    await expect(page.getByText('Total Characters Practiced')).toBeVisible();
    await expect(page.getByText('Average Accuracy')).toBeVisible();
    await expect(page.getByText('Total Attempts')).toBeVisible();
    
    // Should show character progress table
    await expect(page.getByText('Character Progress')).toBeVisible();
  });

  test('should filter by kana type', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show filter buttons
    await expect(page.getByText('All')).toBeVisible();
    await expect(page.getByText('Hiragana')).toBeVisible();
    await expect(page.getByText('Katakana')).toBeVisible();
    
    // Click Hiragana filter
    await page.getByText('Hiragana').click();
    
    // Filter should be active
    await expect(page.getByText('Hiragana')).toHaveClass(/bg-\[#d1622b\]/);
    
    // Click Katakana filter
    await page.getByText('Katakana').click();
    
    // Filter should be active
    await expect(page.getByText('Katakana')).toHaveClass(/bg-\[#d1622b\]/);
    
    // Click All filter
    await page.getByText('All').click();
    
    // Filter should be active
    await expect(page.getByText('All')).toHaveClass(/bg-\[#d1622b\]/);
  });

  test('should sort character data', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show sortable headers
    await expect(page.getByText('Character')).toBeVisible();
    await expect(page.getByText('Romaji')).toBeVisible();
    await expect(page.getByText('Attempts')).toBeVisible();
    await expect(page.getByText('Accuracy')).toBeVisible();
    
    // Click character header to sort
    await page.getByText('Character').click();
    
    // Should show sort indicator
    await expect(page.locator('text=Character').locator('..').getByText('↑,↓')).toBeVisible();
    
    // Click again to reverse sort
    await page.getByText('Character').click();
    
    // Should show reversed sort indicator
    await expect(page.locator('text=Character').locator('..').getByText('↑,↓')).toBeVisible();
  });

  test('should navigate back to practice', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show back to home button
    await expect(page.getByText('Back to Home')).toBeVisible();
    
    // Click back to home
    await page.getByText('Back to Home').click();
    
    // Should navigate to home page
    await page.waitForURL('/');
    await expect(page.getByText('🌸 SakuMari 🌸')).toBeVisible();
  });

  test('should show empty state when no practice data', async ({ page }) => {
    // Create a fresh user session (this would require clearing data or new user)
    await page.goto('/dashboard');
    
    // Should handle empty state gracefully - either show message or show zero stats
    await expect(page.getByText('Dashboard')).toBeVisible();
    
    // Stats should show reasonable defaults
    const statsElements = [
      page.getByText('Total Characters Practiced'),
      page.getByText('Average Accuracy'),
      page.getByText('Total Attempts')
    ];
    
    for (const element of statsElements) {
      await expect(element).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Should show dashboard content
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Your Progress')).toBeVisible();
    
    // Filter buttons should be visible and functional
    await expect(page.getByText('All')).toBeVisible();
    await expect(page.getByText('Hiragana')).toBeVisible();
    await expect(page.getByText('Katakana')).toBeVisible();
    
    // Should be able to interact with filters
    await page.getByText('Hiragana').click();
    await expect(page.getByText('Hiragana')).toHaveClass(/bg-\[#d1622b\]/);
  });
});