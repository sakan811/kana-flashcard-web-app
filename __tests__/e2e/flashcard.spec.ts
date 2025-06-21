import { test, expect } from '@playwright/test';

test.describe('Flashcard Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign In with Google' }).click();
    await page.waitForURL('**/auth/signin');
    await page.getByLabel('Password').fill('test123');
    await page.getByRole('button', { name: 'Sign in with Test User' }).click();
    await page.waitForURL('/');
  });

  test('should practice hiragana flashcards', async ({ page }) => {
    await page.getByText('ひらがな Hiragana Practice').click();
    await page.waitForURL('/hiragana');

    // Should show typing mode by default
    await expect(page.getByPlaceholderText('Type romaji equivalent...')).toBeVisible();
    
    // Test typing interaction
    await page.getByPlaceholderText('Type romaji equivalent...').fill('a');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show result
    await expect(page.locator('text=Correct!,text=Incorrect!')).toBeVisible();
  });

  test('should practice katakana flashcards', async ({ page }) => {
    await page.getByText('カタカナ Katakana Practice').click();
    await page.waitForURL('/katakana');

    // Should show typing interface
    await expect(page.getByPlaceholderText('Type romaji equivalent...')).toBeVisible();
    
    // Test interaction
    await page.getByPlaceholderText('Type romaji equivalent...').fill('a');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show result
    await expect(page.locator('text=Correct!,text=Incorrect!')).toBeVisible();
  });

  test('should validate empty input', async ({ page }) => {
    await page.goto('/hiragana');
    
    // Try to submit without input
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show validation error
    await expect(page.getByText('Please enter an answer')).toBeVisible();
  });

  test('should switch between interaction modes', async ({ page }) => {
    await page.goto('/hiragana');
    
    // Should start in typing mode
    await expect(page.getByPlaceholderText('Type romaji equivalent...')).toBeVisible();
    
    // Switch to multiple choice
    await page.getByText('Choices').click();
    
    // Should hide typing input and show choices
    await expect(page.getByPlaceholderText('Type romaji equivalent...')).not.toBeVisible();
    await expect(page.getByText('Tap to select your answer')).toBeVisible();
    
    // Switch back to typing
    await page.getByText('Typing').click();
    
    // Should show typing input again
    await expect(page.getByPlaceholderText('Type romaji equivalent...')).toBeVisible();
  });

  test('should use multiple choice mode', async ({ page }) => {
    await page.goto('/hiragana');
    
    // Switch to multiple choice
    await page.getByText('Choices').click();
    
    // Wait for choices to load
    await page.waitForSelector('button:has-text("a"),button:has-text("ka"),button:has-text("sa")', { timeout: 5000 });
    
    // Select first choice
    const firstChoice = page.locator('button').filter({ hasText: /^[a-z]+$/ }).first();
    await firstChoice.click();
    
    // Should show selection
    await expect(firstChoice.locator('text=✓')).toBeVisible();
    
    // Submit answer
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show result
    await expect(page.locator('text=Correct!,text=Incorrect!')).toBeVisible();
  });

  test('should proceed to next card', async ({ page }) => {
    await page.goto('/hiragana');
    
    // Answer current card
    await page.getByPlaceholderText('Type romaji equivalent...').fill('a');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for result
    await expect(page.locator('text=Correct!,text=Incorrect!')).toBeVisible();
    
    // Click next card
    await page.getByRole('button', { name: 'Next Card' }).click();
    
    // Should show new card (result should be hidden)
    await expect(page.locator('text=Correct!,text=Incorrect!')).not.toBeVisible();
    await expect(page.getByPlaceholderText('Type romaji equivalent...')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/hiragana');
    
    // Type answer and press Enter
    await page.getByPlaceholderText('Type romaji equivalent...').fill('a');
    await page.getByPlaceholderText('Type romaji equivalent...').press('Enter');
    
    // Should show result
    await expect(page.locator('text=Correct!,text=Incorrect!')).toBeVisible();
    
    // Press Enter to go to next card
    await page.keyboard.press('Enter');
    
    // Should show new card
    await expect(page.locator('text=Correct!,text=Incorrect!')).not.toBeVisible();
  });
});