import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    headless: true,
    baseURL: process.env.BASE_URL ?? 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'WebKit',   use: { ...devices['Desktop Safari'] } },
    { name: 'Firefox',  use: { ...devices['Desktop Firefox'] } },
  ],
  // Optional: auto-run your dev server for local runs
  // webServer: { command: 'npm run dev', port: 3001, reuseExistingServer: !process.env.CI },
});