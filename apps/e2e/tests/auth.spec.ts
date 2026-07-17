import { test, expect } from '@playwright/test';

test.describe('Phase 2B: Authentication & Access Control', () => {
  const adminEmail = 'admin@csea.kitsw.ac.in';
  const adminPassword = 'Password123';

  test.beforeEach(async ({ page }) => {
    // Route browser console logs and errors to terminal logs for debugging
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message));
  });

  test('Unauthenticated user is redirected to Login page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Wait for the login heading to be visible
    try {
      await page.waitForSelector('h1', { timeout: 10000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/timeout-screenshot.png' });
      throw e;
    }
    
    await expect(page.locator('h1')).toHaveText('CSEA Control');
    await expect(page.locator('text=Sign in to the administrative panel')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign In');
  });

  test('Invalid login attempts show error message', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    await page.fill('input[type="email"]', 'wrong@csea.kitsw.ac.in');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('Successful login opens dashboard and session persists on refresh', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');

    // Wait for the login form to disappear (signifying successful login and component switch)
    await expect(page.locator('form')).toBeHidden({ timeout: 10000 });

    // Verify dashboard elements are loaded
    await expect(page.locator('text=CSEA CONTROL')).toBeVisible();
    await expect(page.locator('text=Platform Health')).toBeVisible();

    // Refresh page
    await page.reload();

    // Verify session persistence
    await expect(page.locator('text=CSEA CONTROL')).toBeVisible();
    await expect(page.locator('text=Platform Health')).toBeVisible();
  });

  test('Sign Out returns user to Login page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    // Wait for login form to disappear
    await expect(page.locator('form')).toBeHidden({ timeout: 10000 });

    // Click Admin User footer trigger to open dropdown
    await page.click('text=Admin User');
    
    // Click Sign Out button inside dropdown
    await page.click('text=Sign Out');

    // Should display login screen again
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('CSEA Control');
  });
});
