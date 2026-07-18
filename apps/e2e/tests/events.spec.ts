import { test, expect } from '@playwright/test';
import { gotoAndWaitForInitialSession, signInAsSuperAdmin } from './support/auth';
import { ADMIN_BASE_URL, API_BASE_URL, PUBLIC_WEB_BASE_URL } from './support/urls';
import { makeE2eSlug, makeE2eTitle } from './support/test-data';
import { closeDatabase, deleteEventsBySlug, findEventBySlug } from './support/database';

const eventSlug = makeE2eSlug('events', 'public-published');
const eventTitle = makeE2eTitle('Events', 'Public Published');
const updatedEventTitle = makeE2eTitle('Events', 'Updated Public Published');
const registrationUrl = 'https://forms.google.com/e2e-events-public-published';

test.describe.serial('Events: Admin to public verification', () => {
  test.beforeAll(async () => {
    await deleteEventsBySlug([eventSlug]);
  });

  test.afterAll(async () => {
    await deleteEventsBySlug([eventSlug]);
  });

  test('creates, publishes, updates, hides, and deletes an event across the stack', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
    await signInAsSuperAdmin(page);

    await page.locator('nav').getByText('Events', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();

    await page.getByRole('button', { name: 'New Event' }).click();
    await expect(page.getByRole('heading', { name: 'Create Event' })).toBeVisible();

    await page.getByPlaceholder('e.g. CSEA Orientation 2026').fill(eventTitle);
    await page.getByPlaceholder('e.g. csea-orientation-2026').fill(eventSlug);
    await page.getByPlaceholder('A brief summary for cards and lists (Max 120 chars)').fill('E2E event short description');
    await page.getByPlaceholder('Detailed event description').fill('E2E event full description');

    await page.getByRole('button', { name: 'Date & Location' }).click();
    await page.locator('input[type="datetime-local"]').first().fill('2026-08-20T10:00');
    await page.locator('input[type="datetime-local"]').nth(1).fill('2026-08-20T12:00');
    await page.getByPlaceholder('e.g. Main Auditorium').fill('E2E Hall');

    await page.getByRole('button', { name: 'Registration' }).click();
    await page.locator('input[type="checkbox"]').check();
    await page.getByPlaceholder('https://forms.google.com/...').fill(registrationUrl);

    await page.getByRole('button', { name: 'Publishing' }).click();
    await page.locator('select').first().selectOption('PUBLISHED');
    await page.locator('select').nth(1).selectOption('PUBLIC');

    const createResponsePromise = page.waitForResponse(
      response =>
        response.url() === `${API_BASE_URL}/control/events` &&
        response.request().method() === 'POST'
    );
    await page.getByRole('button', { name: 'Create Event' }).click();
    const createResponse = await createResponsePromise;
    expect(createResponse.ok()).toBeTruthy();

    const createdEvent = (await createResponse.json()).data;
    expect(createdEvent).toMatchObject({
      title: eventTitle,
      slug: eventSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      venue: 'E2E Hall',
      registrationUrl,
    });

    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
    await expect(page.getByText(eventTitle)).toBeVisible();

    const controlResponse = await page.request.get(`${API_BASE_URL}/control/events/${createdEvent.id}`);
    expect(controlResponse.ok()).toBeTruthy();
    expect((await controlResponse.json()).data).toMatchObject({
      id: createdEvent.id,
      title: eventTitle,
      slug: eventSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    });

    await expect.poll(async () => {
      const event = await findEventBySlug(eventSlug);
      return event?.title;
    }).toBe(eventTitle);

    const publicApiResponse = await page.request.get(`${API_BASE_URL}/events/${eventSlug}`);
    await expect(publicApiResponse).toBeOK();
    expect((await publicApiResponse.json()).data).toMatchObject({
      title: eventTitle,
      slug: eventSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    });

    await page.goto(`${PUBLIC_WEB_BASE_URL}/events`);
    await expect(page.getByRole('heading', { name: eventTitle })).toBeVisible();

    await page.goto(`${PUBLIC_WEB_BASE_URL}/events/${eventSlug}`);
    await expect(page.getByRole('heading', { name: eventTitle, level: 1 })).toBeVisible();
    await expect(page.getByText('Registration Open')).toBeVisible();
    await expect(page.getByRole('link', { name: /Register Now/ })).toHaveAttribute('href', registrationUrl);
    await expect(page.getByText('E2E event full description')).toHaveCount(0);

    await page.goto(ADMIN_BASE_URL);
    await page.locator('nav').getByText('Events', { exact: true }).click();
    await page.locator('tr', { hasText: eventTitle }).getByRole('button').click();
    await page.getByText('Edit Event').click();
    await expect(page.getByRole('heading', { name: 'Edit Event' })).toBeVisible();
    await page.getByPlaceholder('e.g. CSEA Orientation 2026').fill(updatedEventTitle);

    const updateResponsePromise = page.waitForResponse(
      response =>
        response.url() === `${API_BASE_URL}/control/events/${createdEvent.id}` &&
        response.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).click();
    const updateResponse = await updateResponsePromise;
    expect(updateResponse.ok()).toBeTruthy();
    expect((await updateResponse.json()).data).toMatchObject({
      id: createdEvent.id,
      title: updatedEventTitle,
      slug: eventSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    });

    await expect.poll(async () => {
      const event = await findEventBySlug(eventSlug);
      return event?.title;
    }).toBe(updatedEventTitle);

    await page.goto(`${PUBLIC_WEB_BASE_URL}/events/${eventSlug}`);
    await expect(page.getByRole('heading', { name: updatedEventTitle, level: 1 })).toBeVisible();

    const hideResponse = await page.request.patch(`${API_BASE_URL}/control/events/${createdEvent.id}`, {
      data: { visibility: 'PRIVATE' },
    });
    expect(hideResponse.ok()).toBeTruthy();

    await expect.poll(async () => {
      const event = await findEventBySlug(eventSlug);
      return event?.visibility;
    }).toBe('PRIVATE');

    const hiddenPublicApiResponse = await page.request.get(`${API_BASE_URL}/events/${eventSlug}`);
    expect(hiddenPublicApiResponse.status()).toBe(404);

    await page.goto(`${PUBLIC_WEB_BASE_URL}/events`);
    await expect(page.getByText(updatedEventTitle)).toHaveCount(0);

    const deleteResponse = await page.request.delete(`${API_BASE_URL}/control/events/${createdEvent.id}`);
    expect(deleteResponse.status()).toBe(204);

    await expect.poll(async () => {
      const event = await findEventBySlug(eventSlug);
      return event;
    }).toBeNull();
  });
});
