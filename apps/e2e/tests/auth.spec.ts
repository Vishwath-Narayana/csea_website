import { test, expect, type Page } from '@playwright/test';

const adminEmail = 'admin@csea.kitsw.ac.in';
const adminPassword = 'Password123';

// Returns a promise for the next GET /get-session response with status 200.
// better-auth fires this ~10ms after any sign-in/sign-up POST succeeds,
// via an internal setTimeout that toggles $sessionSignal.
function waitForGetSession(page: Page) {
  return page.waitForResponse(
    r => r.url().includes('/get-session') && r.status() === 200
  );
}

// Navigate and wait for the initial unauthenticated /get-session to complete.
//
// The listener is registered BEFORE goto() so it cannot miss the request:
// React 18 defers useSyncExternalStore subscriptions to the commit phase
// (after browser paint), which means the initial GET /get-session can fire
// after networkidle concludes. Registering before goto() is the only
// race-free way to guarantee the initial check is done before sign-in.
async function gotoAndWaitForInitialSession(page: Page, url: string) {
  const initialSession = waitForGetSession(page);
  await page.goto(url);
  await initialSession;
}

test.describe('Phase 2B: Authentication & Access Control', () => {

  test('Unauthenticated user is redirected to Login page', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, 'http://localhost:5173');

    await expect(page.locator('h1')).toHaveText('Manage the platform with precision.');
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign In');
  });

  test('Invalid login attempts show error message', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, 'http://localhost:5173');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'badpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('.text-red-500').first()).toBeVisible();
  });

  test('Successful login opens dashboard and session persists on refresh', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, 'http://localhost:5173');

    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);

    // Register listener BEFORE clicking so it is ready when better-auth fires
    // the GET /get-session ~10ms after the sign-in POST response arrives.
    await Promise.all([
      waitForGetSession(page),
      page.click('button[type="submit"]'),
    ]);

    await expect(page.locator('text=Platform Health')).toBeVisible();

    // Register before reload; Playwright keeps page-level listeners across navigations.
    const sessionAfterReload = waitForGetSession(page);
    await page.reload();
    await sessionAfterReload;

    await expect(page.locator('text=Platform Health')).toBeVisible();
  });

  test('Sign Out returns user to Login page', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, 'http://localhost:5173');

    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);

    await Promise.all([
      waitForGetSession(page),
      page.click('button[type="submit"]'),
    ]);

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
