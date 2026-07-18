import { test, expect } from '@playwright/test';
import { gotoAndWaitForInitialSession, signInAsSuperAdmin } from './support/auth';
import { ADMIN_BASE_URL, API_BASE_URL, PUBLIC_WEB_BASE_URL } from './support/urls';
import { makeE2eSlug, makeE2eTitle } from './support/test-data';
import { deleteGalleryBySlug, findGalleryBySlug, findPhotosByGallerySlug } from './support/database';

const gallerySlug = makeE2eSlug('galleries', 'album');
const galleryTitle = makeE2eTitle('Galleries', 'Album');
const updatedGalleryTitle = makeE2eTitle('Galleries', 'Updated Album');
const galleryDescription = 'E2E test gallery album for event photography';
const eventDate = '2026-07-18';

// Test image URL - using simple 1x1 PNG data URI that is self-contained
const testImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test.describe.serial('Galleries: Admin to public verification', () => {
  test.beforeAll(async () => {
    await deleteGalleryBySlug([gallerySlug]);
  });

  test.afterAll(async () => {
    await deleteGalleryBySlug([gallerySlug]);
  });

  test('creates, updates, and deletes a public gallery with photos across the stack', async ({ page }) => {
    // Authenticate
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
    await signInAsSuperAdmin(page);

    // Navigate to Galleries
    await page.locator('nav').getByText('Galleries', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Galleries' })).toBeVisible();

    // Click "New Album" button
    await page.getByRole('button', { name: 'New Album' }).click();
    await expect(page.getByRole('heading', { name: 'New Album' })).toBeVisible();

    // Fill gallery metadata form
    const allInputs = page.locator('input');

    // Album Title (first input)
    await allInputs.nth(0).fill(galleryTitle);

    // Slug (second input)
    await allInputs.nth(1).fill(gallerySlug);

    // Description (textarea)
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill(galleryDescription);

    // Event Date (third input - type="date")
    await allInputs.nth(2).fill(eventDate);

    // Visibility select - should be PUBLIC by default, but explicitly set it
    const selects = page.locator('select');
    await selects.nth(0).selectOption('PUBLIC');

    // Add photo via external URL
    // URL input field (4th input)
    const photoUrlInput = allInputs.nth(3);
    await photoUrlInput.fill(testImageUrl);

    // Click "Add URL" button
    const addUrlButton = page.getByRole('button', { name: 'Add URL' });
    await addUrlButton.click();

    // Wait for photo to be added to the preview
    await page.waitForTimeout(300);

    // Verify photo is shown in the gallery preview
    const photoGridItems = page.locator('div.group.relative[class*="aspect"]');
    await expect(photoGridItems).toHaveCount(1);

    // Set up response listener for gallery creation
    const createResponsePromise = page.waitForResponse(
      response =>
        response.url() === `${API_BASE_URL}/control/galleries` &&
        response.request().method() === 'POST',
      { timeout: 15000 }
    );

    // Click "Create & Publish" button
    await page.getByRole('button', { name: 'Create & Publish' }).click();

    const createResponse = await createResponsePromise;
    expect(createResponse.ok()).toBeTruthy();

    const createdGallery = (await createResponse.json()).data;
    expect(createdGallery).toMatchObject({
      title: galleryTitle,
      slug: gallerySlug,
      visibility: 'PUBLIC',
      description: galleryDescription,
    });

    // Verify through control API
    const controlResponse = await page.request.get(`${API_BASE_URL}/control/galleries/${createdGallery.id}`);
    expect(controlResponse.ok()).toBeTruthy();
    const controlData = (await controlResponse.json()).data;
    expect(controlData).toMatchObject({
      id: createdGallery.id,
      title: galleryTitle,
      slug: gallerySlug,
      visibility: 'PUBLIC',
    });
    // Verify photo is included in control response
    expect(controlData.photos).toBeDefined();
    expect(controlData.photos.length).toBe(1);

    // Verify gallery and photo persist in database
    await expect.poll(async () => {
      const gallery = await findGalleryBySlug(gallerySlug);
      return gallery?.title;
    }).toBe(galleryTitle);

    const dbPhotos = await findPhotosByGallerySlug(gallerySlug);
    expect(dbPhotos.length).toBe(1);

    // Verify through public API
    const publicApiResponse = await page.request.get(`${API_BASE_URL}/galleries/${gallerySlug}`);
    expect(publicApiResponse.ok()).toBeTruthy();
    const publicData = (await publicApiResponse.json()).data;
    expect(publicData).toMatchObject({
      title: galleryTitle,
      slug: gallerySlug,
      visibility: 'PUBLIC',
    });
    expect(publicData.photos.length).toBe(1);

    // Verify on public gallery listing page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/gallery`);
    await expect(page.getByRole('heading', { name: galleryTitle })).toBeVisible();

    // Verify on public gallery detail page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/gallery/${gallerySlug}`);
    await expect(page.getByRole('heading', { name: galleryTitle, level: 1 })).toBeVisible();
    await expect(page.getByText(galleryDescription)).toBeVisible();

    // Verify photo count is displayed
    const photoCountText = page.getByText(/ENTRIES/);
    await expect(photoCountText).toContainText('1 IMAGES');

    // Test update flow - change gallery title
    await page.goto(ADMIN_BASE_URL);
    await page.locator('nav').getByText('Galleries', { exact: true }).click();

    // Navigate to the gallery detail/edit by clicking on it
    await page.locator('[class*="group"]', { hasText: galleryTitle }).click();
    await page.waitForLoadState('networkidle');

    // Since there's no dedicated edit page, we need to verify through the API instead
    // Update the gallery title via API
    const updateResponse = await page.request.patch(`${API_BASE_URL}/control/galleries/${createdGallery.id}`, {
      data: { title: updatedGalleryTitle },
    });
    expect(updateResponse.ok()).toBeTruthy();
    expect((await updateResponse.json()).data).toMatchObject({
      id: createdGallery.id,
      title: updatedGalleryTitle,
      slug: gallerySlug,
    });

    // Verify update in database
    await expect.poll(async () => {
      const gallery = await findGalleryBySlug(gallerySlug);
      return gallery?.title;
    }).toBe(updatedGalleryTitle);

    // Verify update on public detail page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/gallery/${gallerySlug}`);
    await expect(page.getByRole('heading', { name: updatedGalleryTitle, level: 1 })).toBeVisible();

    // Test photo removal via API (before visibility change)
    const photoToDelete = dbPhotos[0];
    if (photoToDelete) {
      const deletePhotoResponse = await page.request.delete(
        `${API_BASE_URL}/control/galleries/${createdGallery.id}/photos/${photoToDelete.id}`
      );
      expect(deletePhotoResponse.status()).toBe(204);

      // Verify photo is removed from database
      const remainingPhotos = await findPhotosByGallerySlug(gallerySlug);
      expect(remainingPhotos.length).toBe(0);
    }

    // Test visibility boundary: change to PRIVATE
    const hideResponse = await page.request.patch(`${API_BASE_URL}/control/galleries/${createdGallery.id}`, {
      data: { visibility: 'PRIVATE' },
    });
    expect(hideResponse.ok()).toBeTruthy();

    // Verify it's marked as PRIVATE in database
    await expect.poll(async () => {
      const gallery = await findGalleryBySlug(gallerySlug);
      return gallery?.visibility;
    }).toBe('PRIVATE');

    // Verify it's removed from public API
    const hiddenPublicApiResponse = await page.request.get(`${API_BASE_URL}/galleries/${gallerySlug}`);
    expect(hiddenPublicApiResponse.status()).toBe(404);

    // Verify it's removed from public listing
    await page.goto(`${PUBLIC_WEB_BASE_URL}/gallery`);
    await expect(page.getByText(updatedGalleryTitle)).toHaveCount(0);

    // Test delete gallery
    const deleteResponse = await page.request.delete(`${API_BASE_URL}/control/galleries/${createdGallery.id}`);
    expect(deleteResponse.status()).toBe(204);

    // Verify deletion from database
    await expect.poll(async () => {
      const gallery = await findGalleryBySlug(gallerySlug);
      return gallery;
    }).toBeNull();

    // Verify photos are also deleted (cascade delete)
    const finalPhotos = await findPhotosByGallerySlug(gallerySlug);
    expect(finalPhotos.length).toBe(0);
  });
});
