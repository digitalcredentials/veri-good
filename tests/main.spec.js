import { test, expect } from '@playwright/test';

test.describe('main', () => {
  const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';
  test('displays login fields and actions', async ({ page }) => {
    await page.goto(`${baseUrl}`);
  //  await expect(page.locator('input[name="email"]')).toBeVisible();
   
    await expect(page.getByRole('button', { name: 'Verify' })).toBeVisible();
   
  });
  test('clicks verify', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.getByRole('button', { name: 'Verify' }).click();
    
    
  });
});