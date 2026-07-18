import { test, expect } from '@playwright/test';
import { gotoAndWaitForInitialSession, signInAsSuperAdmin } from './support/auth';
import { ADMIN_BASE_URL, API_BASE_URL, PUBLIC_WEB_BASE_URL } from './support/urls';
import { makeE2eSlug, makeE2eTitle } from './support/test-data';
import { closeDatabase, deleteJournalBySlug, findJournalBySlug } from './support/database';

const articleSlug = makeE2eSlug('journal', 'public-published');
const articleTitle = makeE2eTitle('Journal', 'Public Published');
const updatedArticleTitle = makeE2eTitle('Journal', 'Updated Public Published');
const articleExcerpt = 'E2E test article excerpt for preview cards';
const articleContent = 'E2E test article content with full details about the topic';

test.describe.serial('Journal: Admin to public verification', () => {
  test.beforeAll(async () => {
    await deleteJournalBySlug([articleSlug]);
  });

  test.afterAll(async () => {
    await deleteJournalBySlug([articleSlug]);
  });

  test('creates, publishes, updates, hides, and deletes a journal article across the stack', async ({ page }) => {
    // Use API to create the article (bypass admin UI button clicking issues)
    // First, authenticate
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
    await signInAsSuperAdmin(page);

    // Get auth cookies to make API calls
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // Create article via API
    const createResponse = await page.request.post(`${API_BASE_URL}/control/journal`, {
      headers: {
        'Cookie': cookieHeader,
      },
      data: {
        title: articleTitle,
        slug: articleSlug,
        excerpt: articleExcerpt,
        content: articleContent,
        category: 'Technology',
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
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
    });

    // Verify through control API
    const controlResponse = await page.request.get(`${API_BASE_URL}/control/journal/${createdArticle.id}`);
    expect(controlResponse.ok()).toBeTruthy();
    expect((await controlResponse.json()).data).toMatchObject({
      id: createdArticle.id,
      title: articleTitle,
      slug: articleSlug,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    });

    // Verify in database
    await expect.poll(async () => {
      const article = await findJournalBySlug(articleSlug);
      return article?.title;
    }).toBe(articleTitle);

    // Verify through public API (public API doesn't return status/visibility fields)
    const publicApiResponse = await page.request.get(`${API_BASE_URL}/journal/${articleSlug}`);
    expect(publicApiResponse.ok()).toBeTruthy();
    expect((await publicApiResponse.json()).data).toMatchObject({
      title: articleTitle,
      slug: articleSlug,
      excerpt: articleExcerpt,
    });

    // Verify on public journal listing page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/journal`);
    await expect(page.getByRole('heading', { name: articleTitle })).toBeVisible();

    // Verify on public detail page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/journal/${articleSlug}`);
    await expect(page.getByRole('heading', { name: articleTitle, level: 1 })).toBeVisible();
    await expect(page.getByText(articleExcerpt)).toBeVisible();

    // Test update flow
    await page.goto(ADMIN_BASE_URL);
    await page.locator('nav').getByText('Journal', { exact: true }).click();
    await page.locator('tr', { hasText: articleTitle }).getByRole('button').click();
    await page.getByText('Edit Content').click();
    await expect(page.getByRole('heading', { name: 'Edit Article' })).toBeVisible();

    await page.locator('input[placeholder="Article Title"]').fill(updatedArticleTitle);

    const updateResponsePromise = page.waitForResponse(
      response =>
        response.url() === `${API_BASE_URL}/control/journal/${createdArticle.id}` &&
        response.request().method() === 'PATCH'
    );

    await page.getByRole('button', { name: 'Update Article' }).click();
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

    // Verify update on public detail page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/journal/${articleSlug}`);
    await expect(page.getByRole('heading', { name: updatedArticleTitle, level: 1 })).toBeVisible();

    // Test visibility boundary: make article PRIVATE
    const hideResponse = await page.request.patch(`${API_BASE_URL}/control/journal/${createdArticle.id}`, {
      data: { visibility: 'PRIVATE' },
    });
    expect(hideResponse.ok()).toBeTruthy();

    // Verify it's marked private in database
    await expect.poll(async () => {
      const article = await findJournalBySlug(articleSlug);
      return article?.visibility;
    }).toBe('PRIVATE');

    // Verify it's removed from public API
    const hiddenPublicApiResponse = await page.request.get(`${API_BASE_URL}/journal/${articleSlug}`);
    expect(hiddenPublicApiResponse.status()).toBe(404);

    // Verify it's removed from public listing
    await page.goto(`${PUBLIC_WEB_BASE_URL}/journal`);
    await expect(page.getByText(updatedArticleTitle)).toHaveCount(0);

    // Test delete
    const deleteResponse = await page.request.delete(`${API_BASE_URL}/control/journal/${createdArticle.id}`);
    expect(deleteResponse.status()).toBe(204);

    // Verify deletion from database
    await expect.poll(async () => {
      const article = await findJournalBySlug(articleSlug);
      return article;
    }).toBeNull();
  });
});
