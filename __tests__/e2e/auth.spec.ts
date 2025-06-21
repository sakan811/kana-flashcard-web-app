import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should be authenticated and access protected routes', async ({ page }) => {
    // Tests start already authenticated due to setup
    await page.goto('/');
    
    // Should show authenticated content
    await expect(page.getByText('ひらがな Hiragana Practice')).toBeVisible();
    await expect(page.getByText('カタカナ Katakana Practice')).toBeVisible();
    await expect(page.getByText('📊 View Your Progress')).toBeVisible();
    
    // Should show user profile in header
    await expect(page.getByText('Sign Out')).toBeVisible();
  });

  test('should access hiragana practice', async ({ page }) => {
    await page.goto('/');
    await page.getByText('ひらがな Hiragana Practice').click();
    await page.waitForURL('/hiragana');
    
    // Should show flashcard interface
    await expect(page.getByPlaceholderText('Type romaji equivalent...')).toBeVisible();
    
    // Should show mode selector
    await expect(page.getByText('Typing')).toBeVisible();
    await expect(page.getByText('Choices')).toBeVisible();
  });

  test('should practice flashcard', async ({ page }) => {
    await page.goto('/hiragana');
    
    // Wait for kana to load
    await page.waitForSelector('[data-testid="current-kana"], .text-6xl, .text-7xl, .text-8xl', { timeout: 10000 });
    
    // Type answer
    await page.getByPlaceholderText('Type romaji equivalent...').fill('a');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show result
    await expect(page.locator('text=Correct!,text=Incorrect!')).toBeVisible({ timeout: 5000 });
  });

  test('should switch to multiple choice mode', async ({ page }) => {
    await page.goto('/hiragana');
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="current-kana"], .text-6xl, .text-7xl, .text-8xl', { timeout: 10000 });
    
    // Switch to multiple choice
    await page.getByText('Choices').click();
    
    // Should show choice buttons
    await expect(page.locator('button:has-text("a"),button:has-text("ka"),button:has-text("sa")')).toBeVisible({ timeout: 5000 });
  });

  test('should access dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show dashboard content
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Your Progress')).toBeVisible();
    
    // Should show filter buttons
    await expect(page.getByText('All')).toBeVisible();
    await expect(page.getByText('Hiragana')).toBeVisible();
    await expect(page.getByText('Katakana')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/');
    
    // Should be authenticated initially
    await expect(page.getByText('Sign Out')).toBeVisible();
    
    // Click sign out
    await page.getByText('Sign Out').click();
    
    // Should show welcome message for unauthenticated users
    await expect(page.getByText('Welcome to SakuMari!')).toBeVisible();
    await expect(page.getByText('Sign in with your Google account')).toBeVisible();
  });

  test('should handle unauthenticated access to protected routes', async ({ page }) => {
    // First logout
    await page.goto('/');
    await page.getByText('Sign Out').click();
    
    // Try to access protected route
    await page.goto('/hiragana');
    
    // Should redirect to home
    await page.waitForURL('/');
    
    // Should show sign in prompt
    await expect(page.getByRole('button', { name: 'Sign In with Google' })).toBeVisible();
  });
});