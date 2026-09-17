import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    headless: true,
    baseURL: process.env.BASE_URL ?? 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'WebKit',   use: { ...devices['Desktop Safari'] } },
    { name: 'Firefox',  use: { ...devices['Desktop Firefox'] } },
  ],
  // Serves the demo page the suite drives. Note that it serves the repo root,
  // so the page loads the committed dist/bundle.js and never src/ — rebuild
  // before running, or the suite tests the previous bundle (#16).
  webServer: {
    command: 'npm start',
    url: 'http://localhost:8080/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});