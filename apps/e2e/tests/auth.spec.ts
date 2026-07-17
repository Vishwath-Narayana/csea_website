import { test, expect } from '@playwright/test';
import { db, users } from '@csea/database';
import { eq } from 'drizzle-orm';

const adminEmail = 'admin@csea.kitsw.ac.in';
const adminPassword = 'Password123';

test.describe('Phase 2B: Authentication & Access Control', () => {
  
  test('Unauthenticated user is redirected to Login page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check for unique identifier of the Login page from Phase 2B
    // E.g., The updated UI text
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page.locator('h1')).toHaveText('Manage the platform with precision.');
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign In');
  });

  test('Invalid login attempts show error message', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'badpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('.text-red-500').first()).toBeVisible();
  });

  test('Successful login opens dashboard and session persists on refresh', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');

    // Wait for network/hydration
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify Dashboard loads
    await expect(page.locator('text=Platform Health')).toBeVisible();
    
    // Refresh page to test persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify still logged in
    await expect(page.locator('text=Platform Health')).toBeVisible();
  });

  test('Sign Out returns user to Login page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Login first
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Open Profile dropdown menu (Top Right/Sidebar bottom)
    // Wait for the dropdown trigger to be visible and click it
    const dropdownTrigger = page.locator('div.flex.w-full.cursor-pointer.items-center').first();
    await dropdownTrigger.waitFor({ state: 'visible' });
    await dropdownTrigger.click();

    // Click Sign Out
    await page.click('text=Sign Out');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Should display login screen again
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Manage the platform with precision.');
  });
});
