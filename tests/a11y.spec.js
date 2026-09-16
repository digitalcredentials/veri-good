import { test, expect } from '@playwright/test';

const validStatusNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"
const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

// A status message with no role is not programmatically determinable, so a
// screen reader user gets nothing when verification fails (WCAG 4.1.3, AA).
// Assert the roles reach the rendered element rather than only the markup --
// an attribute that never makes it through the build announces nothing.
test.describe('status messages are announced', () => {

  test('a failure exposes an alert carrying the specific reason', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    const alert = page.locator('#error-message')
    await expect(alert).toHaveAttribute('role', 'alert')

    await page.locator('#vc-paste').fill('something that is not a credential');
    await page.getByRole('button', { name: 'Verify', exact: true }).click();

    // the alert must carry the specific reason, not just the generic copy
    // that sits above it in #error-container
    await expect(alert).toHaveText("The credential you provided couldn't be processed.")
    await expect(alert).toBeVisible()
    // and be reachable as an alert, which is what a screen reader acts on
    await expect(page.getByRole('alert')).toContainText("couldn't be processed")
  });

  test('the running checks are a polite live region', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    const list = page.locator('#result-list')
    await expect(list).toHaveAttribute('role', 'status')
    await expect(list).toHaveAttribute('aria-live', 'polite')

    await page.locator('#vc-paste').fill(validStatusNoExpiry);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#sig-message')).toHaveText('Signature is valid.')

    // the results are announced from inside the live region, not somewhere else
    await expect(list.locator('#sig-message')).toBeVisible()
    await expect(page.getByRole('status')).toContainText('Signature is valid.')
  });

});
