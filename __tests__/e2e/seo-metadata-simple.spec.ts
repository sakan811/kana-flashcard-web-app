/**
 * Simple SEO E2E Tests
 * Focused tests for SEO metadata without complex authentication flows
 */

import { test, expect } from '@playwright/test';

test.describe('SEO Metadata - Production Build', () => {
  test.describe('Home Page SEO', () => {
    test('should have correct title and basic meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check title
      await expect(page).toHaveTitle(/SakuMari/);

      // Check that basic meta tags exist
      const charset = page.locator('meta[charset]');
      await expect(charset).toBeAttached();

      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toBeAttached();

      // Check that description meta tag exists
      const description = page.locator('meta[name="description"]');
      await expect(description).toBeAttached();
      
      const descriptionContent = await description.getAttribute('content');
      expect(descriptionContent).toContain('Japanese');
      expect(descriptionContent).toContain('Hiragana');
      expect(descriptionContent).toContain('Katakana');
    });

    test('should have language declaration', async ({ page }) => {
      await page.goto('/');
      
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe('en');
    });

    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/');
      
      // Wait for content to load
      await page.waitForSelector('h1', { timeout: 10000 });

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      const h1Text = await page.locator('h1').first().textContent();
      expect(h1Text).toContain('SakuMari');
    });
  });

  test.describe('Page-Specific SEO', () => {
    test('should have unique titles for different pages', async ({ page }) => {
      // Test home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const homeTitle = await page.title();
      expect(homeTitle).toContain('SakuMari');

      // Test hiragana page
      await page.goto('/hiragana');
      await page.waitForLoadState('networkidle');
      const hiraganaTitle = await page.title();
      expect(hiraganaTitle).toContain('Hiragana');
      expect(hiraganaTitle).toContain('SakuMari');

      // Test katakana page
      await page.goto('/katakana');
      await page.waitForLoadState('networkidle');
      const katakanaTitle = await page.title();
      expect(katakanaTitle).toContain('Katakana');
      expect(katakanaTitle).toContain('SakuMari');

      // Verify titles are unique
      expect(homeTitle).not.toBe(hiraganaTitle);
      expect(homeTitle).not.toBe(katakanaTitle);
      expect(hiraganaTitle).not.toBe(katakanaTitle);
    });

    test('should have page-specific meta descriptions', async ({ page }) => {
      const pages = [
        { path: '/', keyword: 'Master Japanese' },
        { path: '/hiragana', keyword: 'Hiragana characters' },
        { path: '/katakana', keyword: 'Katakana characters' },
      ];

      for (const { path, keyword } of pages) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        const description = page.locator('meta[name="description"]');
        await expect(description).toBeAttached();
        
        const content = await description.getAttribute('content');
        expect(content).toContain(keyword);
      }
    });
  });

  test.describe('Technical SEO', () => {
    test('should not have duplicate meta tags', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for duplicate charset tags
      const charsetTags = await page.locator('meta[charset]').count();
      expect(charsetTags).toBe(1);

      // Check for duplicate viewport tags
      const viewportTags = await page.locator('meta[name="viewport"]').count();
      expect(viewportTags).toBe(1);

      // Check for duplicate description tags
      const descriptionTags = await page.locator('meta[name="description"]').count();
      expect(descriptionTags).toBe(1);
    });

    test('should load quickly for good SEO performance', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds for good SEO
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not have console errors that affect SEO', async ({ page }) => {
      const consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Filter out non-critical errors
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('404') &&
        !error.includes('net::ERR_FAILED') &&
        !error.includes('ERR_INTERNET_DISCONNECTED')
      );

      if (criticalErrors.length > 0) {
        console.log('Console errors found:', criticalErrors);
      }

      // Should have minimal console errors
      expect(criticalErrors.length).toBeLessThan(3);
    });
  });

  test.describe('Content Quality for SEO', () => {
    test('should have meaningful content on home page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for key SEO content
      await expect(page.locator('text=SakuMari')).toBeVisible();
      await expect(page.locator('text=Japanese')).toBeVisible();
      await expect(page.locator('text=Hiragana')).toBeVisible();
      await expect(page.locator('text=Katakana')).toBeVisible();
      await expect(page.locator('text=flashcard')).toBeVisible();
    });

    test('should have descriptive link text', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for descriptive links (no generic "click here" text)
      const links = page.locator('a');
      const linkCount = await links.count();

      for (let i = 0; i < linkCount; i++) {
        const linkText = await links.nth(i).textContent();
        if (linkText && linkText.trim().length > 0) {
          // Links should not be generic
          expect(linkText.toLowerCase()).not.toContain('click here');
          expect(linkText.toLowerCase()).not.toContain('read more');
          expect(linkText.toLowerCase()).not.toContain('learn more');
        }
      }
    });

    test('should include Japanese characters for language-specific SEO', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Should include actual Japanese characters
      await expect(page.locator('text=ひらがな')).toBeVisible(); // Hiragana
      await expect(page.locator('text=カタカナ')).toBeVisible(); // Katakana
    });
  });
});