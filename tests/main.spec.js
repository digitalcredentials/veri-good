import { test, expect } from '@playwright/test';

const expiredNoStatus = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-noStatus-expired.json"
const expiredAndRevoked = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didKey/oidf-revokedStatus-expired.json"
const revokedNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/bothSignatureTypes/didWeb/legacy-revokedStaus-noExpiry.json"
const validStatusNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"
const badDIDWeb = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/ed25519/didWeb/badDidWeb.json"

const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

test.describe('correct messages show for', () => {
  
  test('expired, no status', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(expiredNoStatus);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('Expired on:')).toBeVisible()
    await expect(page.getByText('Has not been revoked')).toBeVisible()
  });


  test('bad did web', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(badDIDWeb);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText("The credential couldn't be verified.")).toBeVisible()
  });

  test('revoked, no expiry', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(revokedNoExpiry);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('No expiry date.')).toBeVisible()
    await expect(page.getByText('Has been revoked')).toBeVisible()
  });

  test('expired and revoked', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(expiredAndRevoked);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('Expired on:')).toBeVisible()
    await expect(page.getByText('Has been revoked')).toBeVisible()
  });

  test('valid status, no expiry', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(validStatusNoExpiry);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('No expiry date.')).toBeVisible()
    await expect(page.getByText('Has not been revoked')).toBeVisible()
  });
});