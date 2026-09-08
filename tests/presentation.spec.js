import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

// A wallet export: a VerifiablePresentation envelope wrapping one signed VC
// (no credentialStatus, no expiry), issued by a DID registered in the demo
// page's issuer list.
const presentation = readFileSync(
  fileURLToPath(new URL('./fixtures/LCWExperience.json', import.meta.url)),
  'utf8'
);

test.describe('verifiable presentations', () => {

  test('pasted presentation verifies its enclosed credential', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(presentation);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('Signature is valid.')).toBeVisible()
    await expect(page.getByText('No expiry date.')).toBeVisible()
    await expect(page.getByText('Has not been revoked')).toBeVisible()
  });

  test('presentation without a credential shows an error', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(JSON.stringify({
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiablePresentation'],
      verifiableCredential: []
    }));
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('Something went wrong - please try again.')).toBeVisible()
    await expect(page.getByText("The presentation you provided doesn't contain a credential.")).toBeVisible()
  });
});
