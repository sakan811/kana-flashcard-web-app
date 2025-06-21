import { test, expect } from '@playwright/test';

test.describe('Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    // Practice a few cards to generate data for dashboard
    await page.goto('/hiragana');
    
    // Submit a few answers to create practice data
    for (let i = 0; i < 3; i++) {
      // Wait for input to be ready
      await page.waitForSelector('input[placeholder="Type romaji equivalent..."]', { timeout: 10000 });
      
      await page.getByPlaceholder('Type romaji equivalent...').fill('a');
      await page.getByRole('button', { name: 'Submit' }).click();
      
      // Wait for result and go to next card
      await expect(
        page.getByText('Correct!').or(page.getByText('Incorrect!'))
      ).toBeVisible({ timeout: 5000 });
      
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
    await expect(page.getByText('Character').nth(2)).toBeVisible();
    await expect(page.getByText('Romaji')).toBeVisible();
    await expect(page.getByText('Attempts').nth(1)).toBeVisible();
    await expect(page.getByText('Accuracy').nth(1)).toBeVisible();
    
    // Click character header to sort
    await page.getByText('Character').nth(2).click();
    
    // Should show sort indicator (either up or down arrow)
    await expect(
      page.locator('text=Character').locator('..').getByText('↑').or(
        page.locator('text=Character').locator('..').getByText('↓')
      )
    ).toBeVisible();
    
    // Click again to reverse sort
    await page.getByText('Character').nth(2).click();
    
    // Should show sort indicator (arrow should change or remain)
    await expect(
      page.locator('text=Character').locator('..').getByText('↑').or(
        page.locator('text=Character').locator('..').getByText('↓')
      )
    ).toBeVisible();
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