import type { Page } from '@playwright/test';
import { ADMIN_BASE_URL, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from './urls';

export const superAdminCredentials = {
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
};

// Returns a promise for the next GET /get-session response with status 200.
// better-auth fires this shortly after sign-in via an internal session signal.
export function waitForGetSession(page: Page) {
  return page.waitForResponse(
    r => r.url().includes('/get-session') && r.status() === 200
  );
}

// Register the listener before navigation so the initial session check cannot
// race with React's deferred subscription setup.
export async function gotoAndWaitForInitialSession(
  page: Page,
  url = ADMIN_BASE_URL
) {
  const initialSession = waitForGetSession(page);
  await page.goto(url);
  await initialSession;
}

export async function signInAsSuperAdmin(page: Page) {
  await page.fill('input[type="email"]', superAdminCredentials.email);
  await page.fill('input[type="password"]', superAdminCredentials.password);

  await Promise.all([
    waitForGetSession(page),
    page.click('button[type="submit"]'),
  ]);
}
