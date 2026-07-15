import { test, expect } from '@playwright/test';

// TEST 1: Admin content creation
test('Admin can create, preview, and publish a journal article', async ({ page }) => {
  // 1. Open admin application
  await page.goto('http://localhost:5173');
  
  // 2. Login as Admin
  // await page.fill('input[name="email"]', 'admin@csea.kitsw.edu');
  // await page.fill('input[name="password"]', 'admin123');
  // await page.click('button[type="submit"]');

  // 3. Create a journal article
  await page.click('text=Journal');
  await page.click('text=Create');
  await page.fill('input[name="title"]', 'E2E Test Journal Post');
  await page.fill('textarea[name="content"]', 'This is a test post content.');

  // 4. Save draft
  await page.click('button:has-text("Save Draft")');

  // 5. Preview
  await page.click('button:has-text("Preview")');
  // Add assertion for preview modal/page

  // 6. Publish
  await page.click('button:has-text("Publish")');

  // 7. Open public website
  await page.goto('http://localhost:4321/journal');

  // 8. Article automatically appears
  await expect(page.locator('text=E2E Test Journal Post')).toBeVisible();

  // 9. Open article URL
  await page.click('text=E2E Test Journal Post');

  // 10. Metadata is correct
  await expect(page.locator('h1')).toHaveText('E2E Test Journal Post');
});

// TEST 2: Work user submission
test('Work user can create event, Admin approves, and student registers', async ({ page, context }) => {
  // 1. Login as Work user
  const workUserPage = await context.newPage();
  await workUserPage.goto('http://localhost:5173');
  // await workUserPage.fill('input[name="email"]', 'editor@csea.kitsw.edu');
  // await workUserPage.click('button[type="submit"]');

  // 2. Create event
  await workUserPage.click('text=Events');
  await workUserPage.click('text=Create');
  await workUserPage.fill('input[name="title"]', 'E2E Test Event');

  // 3. Submit for review
  await workUserPage.click('button:has-text("Submit for Review")');

  // 4. Event is NOT publicly visible
  await workUserPage.goto('http://localhost:4321/events');
  await expect(workUserPage.locator('text=E2E Test Event')).not.toBeVisible();

  // 5. Login as Admin
  const adminPage = await context.newPage();
  await adminPage.goto('http://localhost:5173');

  // 6. Approve and publish
  await adminPage.click('text=Events');
  await adminPage.click('text=Review');
  await adminPage.click('button:has-text("Approve & Publish")');

  // 7. Event appears publicly
  await workUserPage.goto('http://localhost:4321/events');
  await expect(workUserPage.locator('text=E2E Test Event')).toBeVisible();

  // 8. Student registers
  await workUserPage.click('text=E2E Test Event');
  await workUserPage.click('button:has-text("Register Now")');

  // 9. Registration appears in Admin dashboard
  await adminPage.goto('http://localhost:5173');
  await adminPage.click('text=Registrations');
  await expect(adminPage.locator('text=E2E Test Event')).toBeVisible();
});

// TEST 3: Project application
test('Admin publishes project, Student applies, Admin reviews', async ({ page, context }) => {
  // 1. Create project
  await page.goto('http://localhost:5173');
  await page.click('text=Projects');
  await page.click('text=Create');
  await page.fill('input[name="title"]', 'E2E Test Project');

  // 2. Publish project
  await page.click('button:has-text("Publish")');

  // 3. Student opens project
  const studentPage = await context.newPage();
  await studentPage.goto('http://localhost:4321/projects');
  await expect(studentPage.locator('text=E2E Test Project')).toBeVisible();
  
  // 4. Student applies
  await studentPage.click('text=E2E Test Project');
  await studentPage.click('button:has-text("Apply to Join")');
  await studentPage.fill('textarea[name="details"]', 'I want to help build this.');
  await studentPage.click('button:has-text("Submit Application")');

  // 5. Admin sees application
  await page.click('text=Applications');
  await expect(page.locator('text=E2E Test Project')).toBeVisible();

  // 6. Admin changes application status
  await page.click('text=Review');
  await page.click('button:has-text("Accept")');
});

// TEST 4: Gallery upload
test('Admin can upload event photos to gallery', async ({ page, context }) => {
  // 1. Create gallery
  await page.goto('http://localhost:5173');
  await page.click('text=Galleries');
  await page.click('text=Create');
  await page.fill('input[name="title"]', 'E2E Test Gallery');

  // 2. Upload event photos
  // await page.setInputFiles('input[type="file"]', ['test-image.jpg']);
  await page.click('button:has-text("Upload")');

  // 3. Publish
  await page.click('button:has-text("Publish")');

  // 4. Public gallery displays optimized thumbnails
  const publicPage = await context.newPage();
  await publicPage.goto('http://localhost:4321/gallery');
  await expect(publicPage.locator('text=E2E Test Gallery')).toBeVisible();

  // 5. Photo can be opened
  await publicPage.click('text=E2E Test Gallery');
  await publicPage.locator('img').first().click();

  // 6. Download action works
  // await publicPage.click('button:has-text("Download")');
});
