import { test, expect } from '@playwright/test';

const validStatusNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"
const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

// The seven elements carrying class="to-clear" in the markup. reset() clears
// them by selector, so a selector that doesn't match the markup leaves stale
// text behind on every one of them.
const toClearIds = [
  '#holder-name',
  '#cred-name',
  '#issuer-name',
  '#more-title',
  '#more-description',
  '#more-issued-date',
  '#error-message'
]

// A credential populates the six card and dialog fields; garbage populates
// only the error message. Verifying one after the other is what exposes text
// carried over from the previous verification.
const populatedByCredential = toClearIds.filter(id => id !== '#error-message')

const verify = async (page, input) => {
  await page.locator('#vc-paste').fill(input);
  await page.getByRole('button', { name: 'Verify', exact: true }).click();
}

const verifyAnother = async (page) => {
  await page.getByRole('button', { name: 'Verify Another' }).click();
}

test.describe('reset clears every to-clear element', () => {

  test('a credential then garbage leaves no text from the credential', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await verify(page, validStatusNoExpiry);
    await expect(page.locator('#more-issued-date')).not.toBeEmpty()

    await verifyAnother(page);
    await verify(page, 'something that is not a credential');
    await expect(page.getByText("The credential you provided couldn't be processed.")).toBeVisible()

    // the second verification writes only #error-message, so anything left in
    // the other six came from the first credential
    for (const id of populatedByCredential) {
      await expect(page.locator(id)).toBeEmpty()
    }
  });

  test('garbage then a credential renders every field, none suppressed', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await verify(page, 'something that is not a credential');
    await expect(page.getByText("The credential you provided couldn't be processed.")).toBeVisible()

    await verifyAnother(page);
    await verify(page, validStatusNoExpiry);
    await expect(page.locator('#more-issued-date')).not.toBeEmpty()

    for (const id of populatedByCredential) {
      await expect(page.locator(id)).not.toBeEmpty()
    }
    await expect(page.locator('#error-message')).toBeEmpty()
  });

  test('everything else reset already did still happens', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await verify(page, validStatusNoExpiry);
    await expect(page.locator('#more-issued-date')).not.toBeEmpty()
    await expect(page.locator('#more-criteria')).not.toBeEmpty()

    await verifyAnother(page);

    // criteria and alignment markup emptied
    await expect(page.locator('#more-criteria')).toBeEmpty()
    await expect(page.locator('#more-alignment-list')).toBeEmpty()

    // the three check messages back to their verifying text
    await expect(page.locator('#sig-message')).toHaveText('Verifying signature...')
    await expect(page.locator('#exp-message')).toHaveText('Checking expiration...')
    await expect(page.locator('#rev-message')).toHaveText('Checking status...')

    // paste box cleared
    await expect(page.locator('#vc-paste')).toHaveValue('')

    // loader rings restored
    await expect(page.locator('.circle-loader.load-complete')).toHaveCount(0)
    await expect(page.locator('.circle-loader')).not.toHaveCount(0)
  });

});
