import { test, expect } from '@playwright/test';

const validStatusNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"
const tampered = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/ed25519/didKey/legacy-noStatus-noExpiry-tampered.json"
const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

// A status message with no role is not programmatically determinable, so a
// screen reader user gets nothing when verification fails (WCAG 4.1.3, AA).
// Assert the roles reach the rendered element rather than only the markup --
// an attribute that never makes it through the build announces nothing.
test.describe('status messages are announced', () => {

  test('a fixable failure is announced beside the input that caused it', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await expect(page.locator('#input-error')).toHaveAttribute('role', 'alert')
    // and is tied to the textarea, so the error is reachable from the field
    await expect(page.locator('#vc-paste')).toHaveAttribute('aria-describedby', 'input-error')

    await page.locator('#vc-paste').fill('something that is not a credential');
    await page.getByRole('button', { name: 'Verify', exact: true }).click();

    await expect(page.locator('#input-error-text'))
      .toHaveText("The credential you provided couldn't be processed.")
    await expect(page.getByRole('alert')).toContainText("couldn't be processed")
  });

  test('an unfixable failure is announced as an alert on the card', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await expect(page.locator('#error-container')).toHaveAttribute('role', 'alert')

    await page.locator('#vc-paste').fill(tampered);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();

    await expect(page.locator('#error-title')).toHaveText("Couldn't verify this credential")
    await expect(page.getByRole('alert')).toContainText("couldn't be verified")
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

const invalidURL = "https://yodidodido.example.org/notAFile.json"

// The point of putting fixable errors on the field is that the user keeps
// what they pasted. Losing a credential to a typo is the real cost of an
// error here, so these assert the recovery, not just the wording.
test.describe('a fixable error leaves the user able to fix it', () => {

  test('the pasted text survives the error', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(invalidURL);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#input-error')).toBeVisible()

    // still there to be edited, not cleared behind a "Verify Another"
    await expect(page.locator('#vc-paste')).toHaveValue(invalidURL)
    await expect(page.getByRole('button', { name: 'Verify', exact: true })).toBeVisible()
  });

  // Mutation testing found this untested: removing the class broke nothing.
  // The message alone carries the error otherwise, which leaves the field
  // itself looking untouched.
  test('the field that caused the error is marked', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill('something that is not a credential');
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#input-error')).toBeVisible()

    await expect(page.locator('#vc-paste')).toHaveClass(/invalid/)
    // and it has to be a visible border, not just a class nothing styles
    const border = await page.locator('#vc-paste').evaluate(el => {
      const cs = getComputedStyle(el)
      return { width: cs.borderTopWidth, color: cs.borderTopColor }
    })
    expect(border.width).not.toBe('0px')
    expect(border.color).not.toBe('rgba(0, 0, 0, 0)')

    // and it clears with the message
    await page.locator('#vc-paste').fill('h')
    await expect(page.locator('#vc-paste')).not.toHaveClass(/invalid/)
  });

  test('editing the box drops an error that no longer applies', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill('something that is not a credential');
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#input-error')).toBeVisible()

    await page.locator('#vc-paste').fill('h');
    await expect(page.locator('#input-error')).toBeHidden()
    await expect(page.locator('#input-error-text')).toBeEmpty()
  });

  test('an unfixable failure does not blame the input', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(tampered);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#error-title')).toBeVisible()

    // no red ring, no field-level message: the paste was correct
    await expect(page.locator('#input-error')).toBeHidden()
    await expect(page.locator('#vc-paste')).not.toHaveClass(/invalid/)
  });

});

const badDidWeb = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/ed25519/didWeb/badDidWeb.json"

// verify.js returns the same {signature: {valid:false}} shape for a tampered
// credential and for an issuer DID that will not resolve, so the alert title
// must not name a cause. Accusing an issuer of tampering when their DID was
// merely unreachable is a worse failure than saying nothing specific.
test('an unresolvable issuer is not reported as a bad signature', async ({ page }) => {
  await page.goto(`${baseUrl}`);
  await page.locator('#vc-paste').fill(badDidWeb);
  await page.getByRole('button', { name: 'Verify', exact: true }).click();
  await expect(page.locator('#error-title')).toBeVisible()

  await expect(page.locator('#error-title')).not.toContainText('Signature')
  await expect(page.locator('#error-title')).toHaveText("Couldn't verify this credential")
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

    // What a screen reader actually reads: textContent includes decorative
    // glyphs, which are aria-hidden and must not be announced. Asserting the
    // accessible text checks both that the message is exact and that the
    // decoration is properly hidden.
    const announced = await page.getByRole('alert').evaluate(el => {
      const clone = el.cloneNode(true)
      clone.querySelectorAll('[aria-hidden="true"]').forEach(n => n.remove())
      return clone.textContent.replace(/\s+/g, ' ').trim()
    })
    expect(announced).toBe("The credential you provided couldn't be processed.")
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
