import { test, expect } from '@playwright/test';
import { gotoAndWaitForInitialSession, signInAsSuperAdmin } from './support/auth';
import { ADMIN_BASE_URL, API_BASE_URL, PUBLIC_WEB_BASE_URL } from './support/urls';
import { makeE2eSlug, makeE2eTitle } from './support/test-data';
import { closeDatabase, deleteJournalBySlug, findJournalBySlug } from './support/database';

const articleSlug = makeE2eSlug('journal', 'public-published');
const articleTitle = makeE2eTitle('Journal', 'Public Published');
const updatedArticleTitle = makeE2eTitle('Journal', 'Updated Public Published');
const articleExcerpt = 'E2E test article excerpt for preview cards';
const driveUrl = 'https://drive.google.com/file/d/1e2e_journal_test_report/view';

test.describe.serial('Journal: Admin to public verification', () => {
  test.beforeAll(async () => {
    await deleteJournalBySlug([articleSlug]);
  });

  test.afterAll(async () => {
    await deleteJournalBySlug([articleSlug]);
  });

  test('creates, publishes, updates, hides, and deletes a journal article across the stack', async ({ page }) => {
    // Authenticate
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
    await signInAsSuperAdmin(page);

    // Get auth cookies to make API calls
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // ── Create article via API ────────────────────────────────────────────────
    const createResponse = await page.request.post(`${API_BASE_URL}/control/journal`, {
      headers: { 'Cookie': cookieHeader },
      data: {
        title: articleTitle,
        slug: articleSlug,
        excerpt: articleExcerpt,
        category: 'Technology',
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        googleDriveUrl: driveUrl,
      },
    });

    expect(createResponse.ok()).toBeTruthy();

    const createdArticle = (await createResponse.json()).data;
    expect(createdArticle).toMatchObject({
      title: articleTitle,
      slug: articleSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      excerpt: articleExcerpt,
      googleDriveUrl: driveUrl,
    });

    // ── Verify via control API ────────────────────────────────────────────────
    const controlResponse = await page.request.get(`${API_BASE_URL}/control/journal/${createdArticle.id}`);
    expect(controlResponse.ok()).toBeTruthy();
    expect((await controlResponse.json()).data).toMatchObject({
      id: createdArticle.id,
      title: articleTitle,
      slug: articleSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      googleDriveUrl: driveUrl,
    });

    // ── Verify in database ────────────────────────────────────────────────────
    await expect.poll(async () => {
      const article = await findJournalBySlug(articleSlug);
      return article?.title;
    }).toBe(articleTitle);

    // ── Verify via public API — googleDriveUrl must be present ────────────────
    const publicApiResponse = await page.request.get(`${API_BASE_URL}/journal/${articleSlug}`);
    expect(publicApiResponse.ok()).toBeTruthy();
    const publicData = (await publicApiResponse.json()).data;
    expect(publicData).toMatchObject({
      title: articleTitle,
      slug: articleSlug,
      excerpt: articleExcerpt,
    });
    expect(publicData.googleDriveUrl).toBe(driveUrl);

    // ── Verify on public journal listing page ─────────────────────────────────
    await page.goto(`${PUBLIC_WEB_BASE_URL}/journal`);
    await expect(page.getByRole('heading', { name: articleTitle })).toBeVisible();
    await expect(page.getByText(articleExcerpt)).toBeVisible();

    // ── Verify "View Report" link points to the Drive URL and opens in new tab ─
    const viewReportLink = page.locator(`a[href="${driveUrl}"]`).first();
    await expect(viewReportLink).toBeVisible();
    await expect(viewReportLink).toHaveAttribute('target', '_blank');
    await expect(viewReportLink).toHaveAttribute('rel', 'noopener noreferrer');

    // ── Update flow via admin UI ──────────────────────────────────────────────
    await page.goto(ADMIN_BASE_URL);
    await page.locator('nav').getByText('Journal', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Journal' })).toBeVisible();

    // Open the row dropdown and click Edit
    await page.locator('tr', { hasText: articleTitle }).getByRole('button').click();
    await page.getByText('Edit').click();
    await expect(page.getByRole('heading', { name: 'Edit Journal Entry' })).toBeVisible();

    // Update the title
    await page.locator('input[placeholder="Journal entry title"]').fill(updatedArticleTitle);

    const updateResponsePromise = page.waitForResponse(
      response =>
        response.url() === `${API_BASE_URL}/control/journal/${createdArticle.id}` &&
        response.request().method() === 'PATCH'
    );

    await page.getByRole('button', { name: 'Publish' }).click();
    const updateResponse = await updateResponsePromise;
    expect(updateResponse.ok()).toBeTruthy();
    expect((await updateResponse.json()).data).toMatchObject({
      id: createdArticle.id,
      title: updatedArticleTitle,
      slug: articleSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    });

    // Verify update in database
    await expect.poll(async () => {
      const article = await findJournalBySlug(articleSlug);
      return article?.title;
    }).toBe(updatedArticleTitle);

    // Verify updated title appears on public listing
    await page.goto(`${PUBLIC_WEB_BASE_URL}/journal`);
    await expect(page.getByRole('heading', { name: updatedArticleTitle })).toBeVisible();

    // ── Visibility boundary: PRIVATE → hidden from public ─────────────────────
    const hideResponse = await page.request.patch(`${API_BASE_URL}/control/journal/${createdArticle.id}`, {
      data: { visibility: 'PRIVATE' },
    });
    expect(hideResponse.ok()).toBeTruthy();

    // Verify PRIVATE in database
    await expect.poll(async () => {
      const article = await findJournalBySlug(articleSlug);
      return article?.visibility;
    }).toBe('PRIVATE');

    // Verify 404 from public API
    const hiddenPublicApiResponse = await page.request.get(`${API_BASE_URL}/journal/${articleSlug}`);
    expect(hiddenPublicApiResponse.status()).toBe(404);

    // Verify not on public listing
    await page.goto(`${PUBLIC_WEB_BASE_URL}/journal`);
    await expect(page.getByText(updatedArticleTitle)).toHaveCount(0);

    // ── Delete ────────────────────────────────────────────────────────────────
    const deleteResponse = await page.request.delete(`${API_BASE_URL}/control/journal/${createdArticle.id}`);
    expect(deleteResponse.status()).toBe(204);

    // Verify deletion from database
    await expect.poll(async () => {
      const article = await findJournalBySlug(articleSlug);
      return article;
    }).toBeNull();
  });
});
