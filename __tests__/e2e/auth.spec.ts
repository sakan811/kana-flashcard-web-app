import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should complete full auth flow', async ({ page }) => {
    await test.step('should login with test credentials', async () => {
      await page.goto('/');
      
      // Click sign in button - use button role to be more specific
      await page.getByRole('button', { name: 'Sign In with Google' }).click();
      
      // Should redirect to auth signin page
      await page.waitForURL('**/auth/signin');
      
      // Use test credentials
      await page.getByLabel('Password').fill('test123');
      await page.getByRole('button', { name: 'Sign in with Test User' }).click();
      
      // Should redirect back to home
      await page.waitForURL('/');
      
      // Should show authenticated content
      await expect(page.getByText('ひらがな Hiragana Practice')).toBeVisible();
      await expect(page.getByText('カタカナ Katakana Practice')).toBeVisible();
      await expect(page.getByText('📊 View Your Progress')).toBeVisible();
    });

    await test.step('should access hiragana practice', async () => {
      await page.getByText('ひらがな Hiragana Practice').click();
      await page.waitForURL('/hiragana');
      
      // Should show flashcard interface
      await expect(page.getByPlaceholderText('Type romaji equivalent...')).toBeVisible();
      
      // Should show mode selector
      await expect(page.getByText('Typing')).toBeVisible();
      await expect(page.getByText('Choices')).toBeVisible();
    });

    await test.step('should practice flashcard', async () => {
      // Wait for kana to load
      await page.waitForSelector('[data-testid="current-kana"], .text-6xl, .text-7xl, .text-8xl', { timeout: 10000 });
      
      // Type answer
      await page.getByPlaceholderText('Type romaji equivalent...').fill('a');
      await page.getByRole('button', { name: 'Submit' }).click();
      
      // Should show result
      await expect(page.locator('text=Correct!,text=Incorrect!')).toBeVisible({ timeout: 5000 });
    });

    await test.step('should switch to multiple choice mode', async () => {
      // Click next card first if result is showing
      const nextButton = page.getByRole('button', { name: 'Next Card' });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
      
      // Switch to multiple choice
      await page.getByText('Choices').click();
      
      // Should show choice buttons
      await expect(page.locator('button:has-text("a"),button:has-text("ka"),button:has-text("sa")')).toBeVisible({ timeout: 5000 });
    });

    await test.step('should access dashboard', async () => {
      await page.goto('/dashboard');
      
      // Should show dashboard content
      await expect(page.getByText('Dashboard')).toBeVisible();
      await expect(page.getByText('Your Progress')).toBeVisible();
      
      // Should show filter buttons
      await expect(page.getByText('All')).toBeVisible();
      await expect(page.getByText('Hiragana')).toBeVisible();
      await expect(page.getByText('Katakana')).toBeVisible();
    });

    await test.step('should logout', async () => {
      await page.getByText('Sign Out').click();
      
      // Should show welcome message for unauthenticated users
      await expect(page.getByText('Welcome to SakuMari!')).toBeVisible();
      await expect(page.getByText('Sign in with your Google account')).toBeVisible();
    });
  });

  test('should handle unauthenticated access', async ({ page }) => {
    await test.step('should redirect protected routes', async () => {
      // Try to access protected route
      await page.goto('/hiragana');
      
      // Should redirect to home
      await page.waitForURL('/');
      
      // Should show sign in prompt
      await expect(page.getByRole('button', { name: 'Sign In with Google' })).toBeVisible();
    });
  });
});