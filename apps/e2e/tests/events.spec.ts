import { test, expect } from '@playwright/test';
import { gotoAndWaitForInitialSession, signInAsSuperAdmin } from './support/auth';
import { ADMIN_BASE_URL, API_BASE_URL, PUBLIC_WEB_BASE_URL } from './support/urls';
import { makeE2eSlug, makeE2eTitle } from './support/test-data';
import { closeDatabase, deleteEventsBySlug, findEventBySlug } from './support/database';

const eventSlug = makeE2eSlug('events', 'public-published');
const eventTitle = makeE2eTitle('Events', 'Public Published');
const updatedEventTitle = makeE2eTitle('Events', 'Updated Public Published');
const draftSlug = makeE2eSlug('events', 'draft');
const draftTitle = makeE2eTitle('Events', 'Draft');
const pastSlug = makeE2eSlug('events', 'past');
const pastTitle = makeE2eTitle('Events', 'Past');
const registrationUrl = 'https://forms.google.com/e2e-events-public-published';

const now = new Date();

// Future dates for the main upcoming event (30–31 days from now)
const futureStart = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
const futureEnd = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000);

// Past dates for the past-archives event
const pastStart = new Date(now.getTime() - 48 * 60 * 60 * 1000);
const pastEnd = new Date(now.getTime() - 24 * 60 * 60 * 1000);

// Format Date → "YYYY-MM-DDTHH:MM" in local time (for datetime-local inputs)
function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

test.describe.serial('Events: Admin to public verification', () => {
  test.beforeAll(async () => {
    await deleteEventsBySlug([eventSlug, draftSlug, pastSlug]);
  });

  test.afterAll(async () => {
    await deleteEventsBySlug([eventSlug, draftSlug, pastSlug]);
    await closeDatabase();
  });

  test('creates, publishes, filters, updates, hides, and deletes an event across the stack', async ({ page }) => {
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
    await signInAsSuperAdmin(page);

    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // ── A. DRAFT VISIBILITY ───────────────────────────────────────────────────
    const draftCreateRes = await page.request.post(`${API_BASE_URL}/control/events`, {
      headers: { 'Cookie': cookieHeader },
      data: {
        title: draftTitle,
        slug: draftSlug,
        shortDescription: 'E2E draft event — should not be public',
        startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'DRAFT',
        visibility: 'PUBLIC',
      },
    });
    expect(draftCreateRes.ok()).toBeTruthy();

    const draftPublicRes = await page.request.get(`${API_BASE_URL}/events/${draftSlug}`);
    expect(draftPublicRes.status()).toBe(404);

    // ── F. PAST EVENT (for past archives filter) ──────────────────────────────
    const pastCreateRes = await page.request.post(`${API_BASE_URL}/control/events`, {
      headers: { 'Cookie': cookieHeader },
      data: {
        title: pastTitle,
        slug: pastSlug,
        shortDescription: 'E2E past event — should appear in Past Archives',
        startDate: pastStart.toISOString(),
        endDate: pastEnd.toISOString(),
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
      },
    });
    expect(pastCreateRes.ok()).toBeTruthy();

    // ── Create main event via Admin UI ────────────────────────────────────────
    await page.locator('nav').getByText('Events', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();

    await page.getByRole('button', { name: 'New Event' }).click();
    await expect(page.getByRole('heading', { name: 'Create Event' })).toBeVisible();

    await page.getByPlaceholder('e.g. CSEA Orientation 2026').fill(eventTitle);
    await page.getByPlaceholder('e.g. csea-orientation-2026').fill(eventSlug);
    await page.getByPlaceholder('A brief summary for cards and lists (Max 120 chars)').fill('E2E event short description');
    await page.getByPlaceholder('Detailed event description').fill('E2E event full description');

    await page.getByRole('button', { name: 'Date & Location' }).click();
    await page.locator('input[type="datetime-local"]').first().fill(toDatetimeLocal(futureStart));
    await page.locator('input[type="datetime-local"]').nth(1).fill(toDatetimeLocal(futureEnd));
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
      registrationEnabled: true,
    });

    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
    await expect(page.getByText(eventTitle)).toBeVisible();

    // ── Verify via control API ────────────────────────────────────────────────
    const controlResponse = await page.request.get(`${API_BASE_URL}/control/events/${createdEvent.id}`);
    expect(controlResponse.ok()).toBeTruthy();
    expect((await controlResponse.json()).data).toMatchObject({
      id: createdEvent.id,
      title: eventTitle,
      slug: eventSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    });

    // ── Verify in database ────────────────────────────────────────────────────
    await expect.poll(async () => {
      const event = await findEventBySlug(eventSlug);
      return event?.title;
    }).toBe(eventTitle);

    // ── Verify via public API ─────────────────────────────────────────────────
    const publicApiResponse = await page.request.get(`${API_BASE_URL}/events/${eventSlug}`);
    await expect(publicApiResponse).toBeOK();
    expect((await publicApiResponse.json()).data).toMatchObject({
      title: eventTitle,
      slug: eventSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    });

    // ── C. ALL EVENTS FILTER ──────────────────────────────────────────────────
    await page.goto(`${PUBLIC_WEB_BASE_URL}/events`);
    await expect(page.getByRole('heading', { name: eventTitle })).toBeVisible();
    await expect(page.getByText(pastTitle)).toBeVisible();

    // ── D. UPCOMING FILTER ────────────────────────────────────────────────────
    await page.goto(`${PUBLIC_WEB_BASE_URL}/events?filter=upcoming`);
    await expect(page.getByRole('heading', { name: eventTitle })).toBeVisible();
    // G: past event must NOT appear under Upcoming
    await expect(page.getByText(pastTitle)).toHaveCount(0);

    // ── E. REGISTRATION OPEN FILTER ───────────────────────────────────────────
    await page.goto(`${PUBLIC_WEB_BASE_URL}/events?filter=registration-open`);
    await expect(page.getByRole('heading', { name: eventTitle })).toBeVisible();
    // G: past event (no registration) must NOT appear under Registration Open
    await expect(page.getByText(pastTitle)).toHaveCount(0);
    // Verify the Register Now link points to the correct URL
    const registerLink = page.locator(`a[href="${registrationUrl}"]`).first();
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('target', '_blank');
    await expect(registerLink).toHaveAttribute('rel', 'noopener noreferrer');

    // ── F. PAST ARCHIVES FILTER ───────────────────────────────────────────────
    await page.goto(`${PUBLIC_WEB_BASE_URL}/events?filter=past`);
    await expect(page.getByText(pastTitle)).toBeVisible();
    // G: future event must NOT appear under Past Archives
    await expect(page.getByText(eventTitle)).toHaveCount(0);

    // ── B. Detail page verification ───────────────────────────────────────────
    await page.goto(`${PUBLIC_WEB_BASE_URL}/events/${eventSlug}`);
    await expect(page.getByRole('heading', { name: eventTitle, level: 1 })).toBeVisible();
    await expect(page.getByText('Registration Open')).toBeVisible();
    await expect(page.getByRole('link', { name: /Register Now/ })).toHaveAttribute('href', registrationUrl);
    await expect(page.getByText('E2E event full description')).toHaveCount(0);

    // ── H. EDITING via Admin UI ───────────────────────────────────────────────
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

    // ── Visibility boundary: PRIVATE → hidden from public ─────────────────────
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

    // ── I. DELETE ─────────────────────────────────────────────────────────────
    const deleteResponse = await page.request.delete(`${API_BASE_URL}/control/events/${createdEvent.id}`);
    expect(deleteResponse.status()).toBe(204);

    await expect.poll(async () => {
      const event = await findEventBySlug(eventSlug);
      return event;
    }).toBeNull();
  });
});
