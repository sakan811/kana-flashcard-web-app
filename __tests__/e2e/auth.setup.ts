import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to home page
  await page.goto('/');
  
  // Wait for the page to load
  await expect(page.getByText('🌸 SakuMari')).toBeVisible();
  
  // Click sign in button
  await page.getByRole('button', { name: 'Sign In with Google' }).click();
  
  // Should redirect to NextAuth signin page (not Google)
  await page.waitForURL('**/auth/signin', { timeout: 10000 });
  
  // Check if we have the test credentials form
  // If not, we might need to access it directly
  const passwordField = page.getByLabel('Password');
  if (await passwordField.isVisible({ timeout: 5000 })) {
    // Use test credentials
    await passwordField.fill('test123');
    await page.getByRole('button', { name: 'Sign in with Test User' }).click();
  } else {
    // Fallback: navigate directly to test provider
    await page.goto('/api/auth/signin/test-credentials');
    await page.waitForSelector('input[name="password"]', { timeout: 5000 });
    await page.fill('input[name="password"]', 'test123');
    await page.click('button[type="submit"]');
  }
  
  // Wait for redirect back to home page
  await page.waitForURL('/', { timeout: 10000 });
  
  // Verify we're authenticated by checking for authenticated content
  await expect(page.getByText('ひらがな Hiragana Practice')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('カタカナ Katakana Practice')).toBeVisible();
  
  // Save signed-in state to 'storageState.json'
  await page.context().storageState({ path: authFile });
});