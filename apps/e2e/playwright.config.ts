import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import {
  ADMIN_BASE_URL,
  API_HEALTH_URL,
  API_ORIGIN,
  DATABASE_URL,
  PUBLIC_WEB_BASE_URL,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} from './tests/support/urls';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: PUBLIC_WEB_BASE_URL,
    trace: 'on-first-retry',
  },
  timeout: 60000,
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
      url: API_HEALTH_URL,
      timeout: 60_000,
      reuseExistingServer: true,
      env: {
        ...(process.env as Record<string, string>),
        DATABASE_URL,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? API_ORIGIN,
        SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD,
      },
    },
    {
      command: 'pnpm dev --host 0.0.0.0 --port 5173',
      cwd: path.resolve(__dirname, '../admin'),
      url: ADMIN_BASE_URL,
      timeout: 30_000,
      reuseExistingServer: true,
      env: {
        ...(process.env as Record<string, string>),
        VITE_API_URL: `${API_ORIGIN}/api/v1`,
      },
    },
    {
      command: 'pnpm dev --host 0.0.0.0 --port 4321',
      cwd: path.resolve(__dirname, '../web'),
      url: PUBLIC_WEB_BASE_URL,
      timeout: 30_000,
      reuseExistingServer: true,
      env: {
        ...(process.env as Record<string, string>),
        PUBLIC_API_URL: API_ORIGIN,
      },
    },
  ],
});
