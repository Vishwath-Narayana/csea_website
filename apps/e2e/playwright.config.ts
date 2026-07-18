import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321', // Astro dev server
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm dev',
      cwd: path.resolve(__dirname, '../api'),
      url: 'http://localhost:3001/api/v1/health',
      timeout: 60_000,
      reuseExistingServer: true,
      env: {
        ...(process.env as Record<string, string>),
        DATABASE_URL: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/csea',
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3001',
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL ?? 'admin@csea.kitsw.ac.in',
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD ?? 'Password123',
      },
    },
    {
      command: 'pnpm dev',
      cwd: path.resolve(__dirname, '../admin'),
      url: 'http://localhost:5173',
      timeout: 30_000,
      reuseExistingServer: true,
    },
  ],
});
