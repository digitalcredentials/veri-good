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
    // role="status" implies aria-atomic="true", which re-announces the whole
    // list on every staggered reveal, unrun "Checking..." placeholders
    // included. Only the line that changed should be spoken.
    await expect(list).toHaveAttribute('aria-atomic', 'false')

    await page.locator('#vc-paste').fill(validStatusNoExpiry);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#sig-message')).toHaveText('Signature is valid.')

    // the results are announced from inside the live region, not somewhere else
    await expect(list.locator('#sig-message')).toBeVisible()
    await expect(page.getByRole('status')).toContainText('Signature is valid.')
  });

});

// Attribute assertions prove the markup; these prove what the accessibility
// tree actually exposes, which is what a screen reader reads. Closer to the
// real thing than checking role="alert" is present, though still not a
// substitute for listening to it.
test.describe('the accessibility tree exposes the right shape', () => {

  test('a failure surfaces exactly one alert, carrying the reason', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill('something that is not a credential');
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.getByRole('alert')).toBeVisible()

    // one, not several competing for the announcement
    await expect(page.getByRole('alert')).toHaveCount(1)
    await expect(page.getByRole('alert')).toContainText("couldn't be processed")

    // the generic copy above it is not itself an alert, so it is not announced
    // a second time
    const alertText = await page.getByRole('alert').textContent()
    expect(alertText.trim()).toBe("The credential you provided couldn't be processed.")
  });

  test('the checks are one status region holding all three lines', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(validStatusNoExpiry);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#rev-message')).toHaveText('Has not been revoked')

    await expect(page.getByRole('status')).toHaveCount(1)
    const status = page.getByRole('status')
    for (const line of ['Signature is valid.', 'No expiry date.', 'Has not been revoked']) {
      await expect(status).toContainText(line)
    }
  });

});
