import { test, expect } from '@playwright/test';

// Helper function to wait for kana to load
async function waitForKanaLoad(page: any, timeout = 10000) {
  await page.waitForSelector('[data-testid="current-kana"], .text-6xl, .text-7xl, .text-8xl', { timeout });
}

// Helper function to expect either result
async function expectResult(page: any, timeout = 5000) {
  await expect(
    page.getByText('Correct!').or(page.getByText('Incorrect!'))
  ).toBeVisible({ timeout });
}

test.describe('Flashcard Features', () => {
  test('should practice hiragana flashcards', async ({ page }) => {
    await page.goto('/hiragana');
    await waitForKanaLoad(page);
    
    // Should show typing mode by default
    await expect(page.getByPlaceholder('Type romaji equivalent...')).toBeVisible();
    
    // Test typing interaction (use generic answer since kana is random)
    await page.getByPlaceholder('Type romaji equivalent...').fill('a');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show result (either correct or incorrect)
    await expectResult(page);
  });

  test('should practice katakana flashcards', async ({ page }) => {
    await page.goto('/katakana');
    await waitForKanaLoad(page);

    // Should show typing interface
    await expect(page.getByPlaceholder('Type romaji equivalent...')).toBeVisible();
    
    // Test interaction with generic answer
    await page.getByPlaceholder('Type romaji equivalent...').fill('a');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show result
    await expectResult(page);
  });

  test('should validate empty input', async ({ page }) => {
    await page.goto('/hiragana');
    await waitForKanaLoad(page);
    
    // Try to submit without input
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show validation error
    await expect(page.getByText('Please enter an answer')).toBeVisible();
  });

  test('should switch between interaction modes', async ({ page }) => {
    await page.goto('/hiragana');
    await waitForKanaLoad(page);
    
    // Should start in typing mode
    await expect(page.getByPlaceholder('Type romaji equivalent...')).toBeVisible();
    
    // Switch to multiple choice
    await page.getByTestId('multiple-choice-button').click();
    
    // Should hide typing input and show choices
    await expect(page.getByPlaceholder('Type romaji equivalent...')).not.toBeVisible();
    await expect(page.getByText('Tap to select your answer')).toBeVisible();
    
    // Switch back to typing
    await page.getByTestId('typing-button').click();
    
    // Should show typing input again
    await expect(page.getByPlaceholder('Type romaji equivalent...')).toBeVisible();
  });

  test('should use multiple choice mode', async ({ page }) => {
    await page.goto('/hiragana');
    await waitForKanaLoad(page);
    
    // Switch to multiple choice
    await page.getByTestId('multiple-choice-button').click();
    
    // Wait for choices to load by checking for multiple choice buttons
    await page.waitForFunction(() => {
      const buttons = document.querySelectorAll('button');
      const choiceButtons = Array.from(buttons).filter(button => 
        /^[a-z]+$/i.test(button.textContent?.trim() || '') && 
        button.textContent?.trim().length <= 4
      );
      return choiceButtons.length >= 3; // Should have at least 3 choice buttons
    }, { timeout: 10000 });
    
    // Select first available choice
    const choiceButtons = page.locator('button').filter({ hasText: /^[a-z]{1,4}$/ });
    await choiceButtons.first().click();
    
    // Should show selection checkmark
    await expect(page.getByText('✓')).toBeVisible();
    
    // Submit answer
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show result
    await expectResult(page);
  });

  test('should proceed to next card', async ({ page }) => {
    await page.goto('/hiragana');
    await waitForKanaLoad(page);
    
    // Answer current card
    await page.getByPlaceholder('Type romaji equivalent...').fill('a');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for result
    await expectResult(page);
    
    // Click next card
    await page.getByRole('button', { name: 'Next Card' }).click();
    
    // Should show new card (result should be hidden)
    await expect(page.getByText('Correct!')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Incorrect!')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('Type romaji equivalent...')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/hiragana');
    await waitForKanaLoad(page);
    
    // Type answer and press Enter
    await page.getByPlaceholder('Type romaji equivalent...').fill('a');
    await page.getByPlaceholder('Type romaji equivalent...').press('Enter');
    
    // Should show result
    await expectResult(page);
    
    // Press Enter to go to next card
    await page.keyboard.press('Enter');
    
    // Wait for the result to disappear (state transition has 500ms delay)
    await expect(page.getByText('Correct!')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Incorrect!')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('Type romaji equivalent...')).toBeVisible();
  });
});