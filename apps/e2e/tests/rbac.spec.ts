import { test, expect } from '@playwright/test';
import { gotoAndWaitForInitialSession, signInAsSuperAdmin } from './support/auth';
import { ADMIN_BASE_URL, API_BASE_URL } from './support/urls';
import { makeE2eSlug } from './support/test-data';
import { deleteEventsBySlug } from './support/database';

const testEventSlug = makeE2eSlug('rbac', 'event');
const testEventTitle = `[RBAC-TEST] Event ${Date.now()}`;

// Use a shared authenticated browser context for all tests
test.describe.serial('RBAC & Authorization Verification', () => {
  test.beforeAll(async () => {
    await deleteEventsBySlug([testEventSlug]);
  });

  test.afterAll(async () => {
    await deleteEventsBySlug([testEventSlug]);
  });

  test('1. Unauthenticated requests to control endpoints are rejected', async ({ page }) => {
    // Try to access protected endpoints without authentication
    const testEndpoints = [
      `${API_BASE_URL}/control/events`,
      `${API_BASE_URL}/control/journal`,
      `${API_BASE_URL}/control/projects`,
      `${API_BASE_URL}/control/galleries`,
    ];

    for (const endpoint of testEndpoints) {
      const response = await page.request.get(endpoint);
      // Should reject unauthenticated access (401 or 404)
      expect([401, 404]).toContain(response.status());
    }
  });

  test('2. SUPER_ADMIN can create events via authenticated request', async ({ page }) => {
    // Authenticate via UI
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
    await signInAsSuperAdmin(page);

    // Now use the authenticated page context to make API calls
    const createResp = await page.request.post(`${API_BASE_URL}/control/events`, {
      data: {
        title: testEventTitle,
        slug: testEventSlug,
        status: 'DRAFT',
        visibility: 'PUBLIC',
        startDate: new Date('2026-08-20T10:00').toISOString(),
        endDate: new Date('2026-08-20T12:00').toISOString(),
      },
    });
    expect(createResp.ok()).toBeTruthy();
    const createdEvent = (await createResp.json()).data;
    expect(createdEvent.id).toBeDefined();

    // Keep this page open and authenticated for subsequent tests by not closing the context
  });

  test('3. SUPER_ADMIN can read control API endpoints', async ({ browser }) => {
    // Create a new authenticated page
    const page = await browser.newPage();
    try {
      // Authenticate
      await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
      await signInAsSuperAdmin(page);

      // Test reading from various control endpoints
      const controlEndpoints = [
        `${API_BASE_URL}/control/events`,
        `${API_BASE_URL}/control/journal`,
        `${API_BASE_URL}/control/projects`,
        `${API_BASE_URL}/control/galleries`,
      ];

      for (const endpoint of controlEndpoints) {
        const response = await page.request.get(endpoint);
        expect(response.ok()).toBeTruthy();
      }
    } finally {
      await page.close();
    }
  });

  test('4. SUPER_ADMIN can access restricted admin endpoints', async ({ browser }) => {
    // Create a new authenticated page
    const page = await browser.newPage();
    try {
      // Authenticate
      await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
      await signInAsSuperAdmin(page);

      // Test access to settings and users (requireRole: ["SUPER_ADMIN", "ADMIN"])
      const settingsResp = await page.request.get(`${API_BASE_URL}/control/settings`);
      expect(settingsResp.ok()).toBeTruthy();

      const usersResp = await page.request.get(`${API_BASE_URL}/control/users`);
      expect(usersResp.ok()).toBeTruthy();
    } finally {
      await page.close();
    }
  });

  test('5. SUPER_ADMIN can perform full CRUD on content', async ({ browser }) => {
    // Create a new authenticated page
    const page = await browser.newPage();
    try {
      // Authenticate
      await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
      await signInAsSuperAdmin(page);

      // Create
      const createResp = await page.request.post(`${API_BASE_URL}/control/events`, {
        data: {
          title: `${testEventTitle}-crud`,
          slug: `${testEventSlug}-crud`,
          status: 'DRAFT',
          visibility: 'PUBLIC',
          startDate: new Date('2026-08-20T10:00').toISOString(),
          endDate: new Date('2026-08-20T12:00').toISOString(),
        },
      });
      expect(createResp.ok()).toBeTruthy();
      const eventId = (await createResp.json()).data.id;

      // Read
      const readResp = await page.request.get(`${API_BASE_URL}/control/events/${eventId}`);
      expect(readResp.ok()).toBeTruthy();

      // Update
      const updateResp = await page.request.patch(`${API_BASE_URL}/control/events/${eventId}`, {
        data: { title: 'Updated Admin Title' },
      });
      expect(updateResp.ok()).toBeTruthy();

      // Delete
      const deleteResp = await page.request.delete(`${API_BASE_URL}/control/events/${eventId}`);
      expect(deleteResp.status()).toBe(204);
    } finally {
      await page.close();
    }
  });

  test('6. Role-based authorization prevents unauthorized access', async ({ browser }) => {
    // Create a fresh page for unauthenticated test
    const unauthPage = await browser.newPage();
    try {
      // This test verifies that the requireRole middleware is in place
      const unauthResp = await unauthPage.request.get(`${API_BASE_URL}/control/users`);
      expect([401, 404]).toContain(unauthResp.status());
    } finally {
      await unauthPage.close();
    }

    // Create authenticated page for second part
    const authPage = await browser.newPage();
    try {
      // When authenticated as SUPER_ADMIN, should have access
      await gotoAndWaitForInitialSession(authPage, ADMIN_BASE_URL);
      await signInAsSuperAdmin(authPage);

      const authResp = await authPage.request.get(`${API_BASE_URL}/control/users`);
      expect(authResp.ok()).toBeTruthy();
    } finally {
      await authPage.close();
    }
  });
});
