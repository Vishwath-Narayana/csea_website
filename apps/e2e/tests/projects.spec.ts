import { test, expect } from '@playwright/test';
import { gotoAndWaitForInitialSession, signInAsSuperAdmin } from './support/auth';
import { ADMIN_BASE_URL, API_BASE_URL, PUBLIC_WEB_BASE_URL } from './support/urls';
import { makeE2eSlug, makeE2eTitle } from './support/test-data';
import { closeDatabase, deleteProjectBySlug, findProjectBySlug } from './support/database';

const projectSlug = makeE2eSlug('projects', 'recruiting');
const projectTitle = makeE2eTitle('Projects', 'Recruiting');
const updatedProjectTitle = makeE2eTitle('Projects', 'Updated Recruiting');
const shortDesc = 'E2E test project for squad recruitment and system building';
const fullDesc = 'E2E test project with comprehensive details for full description display';
const applicationUrl = 'https://forms.google.com/e2e-project-application';
const techStack = ['TypeScript', 'React', 'PostgreSQL'];

test.describe.serial('Projects: Admin to public verification', () => {
  test.beforeAll(async () => {
    await deleteProjectBySlug([projectSlug]);
  });

  test.afterAll(async () => {
    await deleteProjectBySlug([projectSlug]);
  });

  test('creates, updates, and deletes a public project across the stack', async ({ page }) => {
    // Authenticate
    await gotoAndWaitForInitialSession(page, ADMIN_BASE_URL);
    await signInAsSuperAdmin(page);

    // Navigate to Projects
    await page.locator('nav').getByText('Projects', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Click "New Project" button
    await page.getByRole('button', { name: 'New Project' }).click();
    await expect(page.getByRole('heading', { name: 'Initialize Project' })).toBeVisible();

    // Fill form fields - use page.locator with specific names/indices to avoid confusion
    const allInputs = page.locator('input');

    // Project Name (first input)
    await allInputs.nth(0).fill(projectTitle);

    // Slug (second input)
    await allInputs.nth(1).fill(projectSlug);

    // Short description (first textarea)
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill(shortDesc);

    // Full description (second textarea)
    await textareas.nth(1).fill(fullDesc);

    // Status select (first select)
    const selects = page.locator('select');
    await selects.nth(0).selectOption('RECRUITING');

    // Project Lead input (3rd input after title and slug)
    await allInputs.nth(2).fill('Test Lead');

    // Timeline input (4th input)
    await allInputs.nth(3).fill('Fall 2026');

    // Tech Stack input (5th input)
    await allInputs.nth(4).fill(techStack.join(', '));

    // Repository URL input (6th input)
    await allInputs.nth(5).fill('https://github.com/csea/e2e-project');

    // Demo URL input (7th input)
    await allInputs.nth(6).fill('https://demo.example.com');

    // Application URL input (8th input)
    await allInputs.nth(7).fill(applicationUrl);

    // Set up response listener
    const createResponsePromise = page.waitForResponse(
      response =>
        response.url() === `${API_BASE_URL}/control/projects` &&
        response.request().method() === 'POST',
      { timeout: 15000 }
    );

    // Click Launch Project button
    await page.getByRole('button', { name: 'Launch Project' }).click();

    const createResponse = await createResponsePromise;
    expect(createResponse.ok()).toBeTruthy();

    const createdProject = (await createResponse.json()).data;
    expect(createdProject).toMatchObject({
      title: projectTitle,
      slug: projectSlug,
      status: 'RECRUITING',
      shortDescription: shortDesc,
      projectLead: 'Test Lead',
    });

    // Verify through control API
    const controlResponse = await page.request.get(`${API_BASE_URL}/control/projects/${createdProject.id}`);
    expect(controlResponse.ok()).toBeTruthy();
    expect((await controlResponse.json()).data).toMatchObject({
      id: createdProject.id,
      title: projectTitle,
      slug: projectSlug,
      status: 'RECRUITING',
    });

    // Verify in database
    await expect.poll(async () => {
      const project = await findProjectBySlug(projectSlug);
      return project?.title;
    }).toBe(projectTitle);

    // Verify through public API
    const publicApiResponse = await page.request.get(`${API_BASE_URL}/projects/${projectSlug}`);
    expect(publicApiResponse.ok()).toBeTruthy();
    expect((await publicApiResponse.json()).data).toMatchObject({
      title: projectTitle,
      slug: projectSlug,
      status: 'RECRUITING',
    });

    // Verify on public projects listing page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/projects`);
    await expect(page.getByRole('heading', { name: projectTitle })).toBeVisible();

    // Verify on public detail page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/projects/${projectSlug}`);
    await expect(page.getByRole('heading', { name: projectTitle, level: 1 })).toBeVisible();
    await expect(page.getByText(shortDesc)).toBeVisible();

    // Verify application URL CTA is present
    const applyLink = page.getByRole('link', { name: /Apply to Join Squad/ });
    await expect(applyLink).toHaveAttribute('href', applicationUrl);

    // Test update flow - go back to admin and edit
    await page.goto(ADMIN_BASE_URL);
    await page.locator('nav').getByText('Projects', { exact: true }).click();

    // Find and click the project card
    await page.locator('[class*="group"]', { hasText: projectTitle }).click();

    // Should navigate to detail or be on the project card - look for Edit button or similar
    // The list shows project cards that click through to detail
    // Let's wait and try clicking in the row area
    await page.waitForTimeout(500);

    // Try to find and click the project in the grid
    const projectCard = page.locator('text=' + projectTitle).first();
    await projectCard.click();

    // Wait for navigation to project detail or edit page
    await page.waitForLoadState('networkidle');

    // Look for an edit button or navigate to edit directly
    const editButtons = page.locator('button:has-text("Edit"), button:has-text("Save Changes")');
    if (await editButtons.count() > 0) {
      await editButtons.first().click();
    } else {
      // Navigate directly to edit page
      await page.goto(`${ADMIN_BASE_URL}?view=projects/${createdProject.id}/edit`);
    }

    // Ensure we're on an editable form
    await expect(page.getByRole('heading', { name: /Edit Project|Initialize Project/ })).toBeVisible();

    // Update project title
    const titleInputs = page.locator('input[placeholder="e.g. CSEA Platform Reboot"]');
    await titleInputs.first().clear();
    await titleInputs.first().fill(updatedProjectTitle);

    // Set up update response listener
    const updateResponsePromise = page.waitForResponse(
      response =>
        response.url() === `${API_BASE_URL}/control/projects/${createdProject.id}` &&
        response.request().method() === 'PATCH',
      { timeout: 15000 }
    );

    // Click Save Changes button
    await page.getByRole('button', { name: /Save Changes/ }).click();

    const updateResponse = await updateResponsePromise;
    expect(updateResponse.ok()).toBeTruthy();
    expect((await updateResponse.json()).data).toMatchObject({
      id: createdProject.id,
      title: updatedProjectTitle,
      slug: projectSlug,
      status: 'RECRUITING',
    });

    // Verify update in database
    await expect.poll(async () => {
      const project = await findProjectBySlug(projectSlug);
      return project?.title;
    }).toBe(updatedProjectTitle);

    // Verify update on public detail page
    await page.goto(`${PUBLIC_WEB_BASE_URL}/projects/${projectSlug}`);
    await expect(page.getByRole('heading', { name: updatedProjectTitle, level: 1 })).toBeVisible();

    // Test visibility boundary: change to DRAFT and verify it disappears
    const hideResponse = await page.request.patch(`${API_BASE_URL}/control/projects/${createdProject.id}`, {
      data: { status: 'DRAFT' },
    });
    expect(hideResponse.ok()).toBeTruthy();

    // Verify it's marked as DRAFT in database
    await expect.poll(async () => {
      const project = await findProjectBySlug(projectSlug);
      return project?.status;
    }).toBe('DRAFT');

    // Verify it's removed from public API
    const hiddenPublicApiResponse = await page.request.get(`${API_BASE_URL}/projects/${projectSlug}`);
    expect(hiddenPublicApiResponse.status()).toBe(404);

    // Verify it's removed from public listing
    await page.goto(`${PUBLIC_WEB_BASE_URL}/projects`);
    await expect(page.getByText(updatedProjectTitle)).toHaveCount(0);

    // Test delete
    const deleteResponse = await page.request.delete(`${API_BASE_URL}/control/projects/${createdProject.id}`);
    expect(deleteResponse.status()).toBe(204);

    // Verify deletion from database
    await expect.poll(async () => {
      const project = await findProjectBySlug(projectSlug);
      return project;
    }).toBeNull();
  });
});
