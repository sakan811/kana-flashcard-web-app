import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate directly to the test credentials signin page
  await page.goto('/api/auth/signin');
  
  // Wait for the credentials form to load
  await page.waitForSelector('form', { timeout: 10000 });
  
  // Fill the password field (your test credentials provider expects "test123")
  await page.fill('input[name="password"]', 'test123');
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait for redirect to home page after successful authentication
  await page.waitForURL('/', { timeout: 10000 });
  
  // Verify authentication was successful by checking for authenticated content
  await expect(page.getByText('ひらがな Hiragana Practice')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('カタカナ Katakana Practice')).toBeVisible();
  
  // Save the authenticated state
  await page.context().storageState({ path: authFile });
});