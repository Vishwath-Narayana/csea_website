import { test, expect } from '@playwright/test';
import {
  gotoAndWaitForInitialSession,
  signInAsSuperAdmin,
  waitForGetSession,
} from './support/auth';
import { ADMIN_BASE_URL } from './support/urls';

test.describe('Phase 2B: Authentication & Access Control', () => {

  test('Unauthenticated user is redirected to Login page', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);

    await expect(page.locator('h1')).toHaveText('Manage the platform with precision.');
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign In');
  });

  test('Invalid login attempts show error message', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'badpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('.text-red-500').first()).toBeVisible();
  });

  test('Successful login opens dashboard and session persists on refresh', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);

    await signInAsSuperAdmin(page);

    await expect(page.locator('text=Platform Health')).toBeVisible();

    // Register before reload; Playwright keeps page-level listeners across navigations.
    const sessionAfterReload = waitForGetSession(page);
    await page.reload();
    await sessionAfterReload;

    await expect(page.locator('text=Platform Health')).toBeVisible();
  });

  test('Sign Out returns user to Login page', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);

    await signInAsSuperAdmin(page);

    const dropdownTrigger = page.locator('div.flex.w-full.cursor-pointer.items-center').first();
    await dropdownTrigger.waitFor({ state: 'visible' });
    await dropdownTrigger.click();

    // The Sign Out handler does authClient.signOut() then window.location.href='/'
    // causing a full-page navigation back to the login screen. The better-auth
    // signal-triggered GET /get-session is cancelled by the navigation; the
    // web-first assertions below wait for the login form to appear after the
    // new page loads and its /get-session returns null.
    await page.click('text=Sign Out');

    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Manage the platform with precision.');
  });
});
