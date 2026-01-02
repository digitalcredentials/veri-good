import { test, expect } from '@playwright/test';

const expiredNoStatus = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-noStatus-expired.json"
const expiredAndRevoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-revokedStatus-expired.json"
const revokedNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didWeb/legacy-revokedStaus-noExpiry.json"
const validStatusNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"

const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

test.describe('expired, no status', () => {
  test('displays expired message', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(expiredNoStatus);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('Expired on:')).toBeVisible()
    await expect(page.getByText('Has not been revoked')).toBeVisible()
  });
  });
  test.describe('revoked, no expiry', () => {
  test('displays correct messages', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(revokedNoExpiry);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('No expiry date.')).toBeVisible()
    await expect(page.getByText('Has been revoked')).toBeVisible()
  });
});
test.describe('expired and revoked', () => {
  test('displays correct messages', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(expiredAndRevoked);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('Expired on:')).toBeVisible()
    await expect(page.getByText('Has been revoked')).toBeVisible()
  });
});
test.describe('valid status, no expiry', () => {
  test('displays correct messages', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(validStatusNoExpiry);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('No expiry date.')).toBeVisible()
    await expect(page.getByText('Has not been revoked')).toBeVisible()
  });
});