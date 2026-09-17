import { test, expect } from '@playwright/test';

const validStatusNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"
// A credential that fails verification, rather than input that never parses.
// Both populate only the error message and none of the six card fields, but
// only this one is guaranteed to leave the card on the "Verify Another"
// screen -- a malformed paste is a recoverable input error, which #31 keeps
// on the input with the Verify button.
const tampered = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/ed25519/didKey/legacy-noStatus-noExpiry-tampered.json"
const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

// The elements carrying class="to-clear". reset() clears them by selector, so
// a selector that doesn't match the markup leaves stale text behind on every
// one of them -- which is issue #15.
//
// This list is the floor, not the definition: the test reads the real set out
// of the shadow root and asserts every one of them, so markup added later is
// covered without anyone remembering to come back here. The names are kept
// only as a canary -- if `to-clear` is dropped from one of them, discovery
// would quietly stop checking it, and this list is what notices.
//
// It drifted once already: it said "seven" and listed seven while the markup
// carried nine, because #31 added #error-title and #input-error-text and
// nothing here was executable enough to fail.
const knownToClearIds = [
  '#holder-name',
  '#cred-name',
  '#issuer-name',
  '#more-title',
  '#more-description',
  '#more-issued-date',
  '#error-title',
  '#error-message',
  '#input-error-text'
]

// the set the component actually carries, read at runtime
const discoverToClearIds = (page) => page.evaluate(() =>
  [...document.querySelector('veri-good').shadowRoot.querySelectorAll('.to-clear')]
    .map(el => `#${el.id}`)
)

// A credential populates the six card and dialog fields; a failed verification
// populates only the error message. Verifying one after the other is what
// exposes text carried over from the previous verification.
const cardFields = ['#holder-name', '#cred-name', '#issuer-name']
const dialogFields = ['#more-title', '#more-description', '#more-issued-date']
const populatedByCredential = [...cardFields, ...dialogFields]

// the three dialog fields sit inside <dialog id="more-dialog">, so they are
// only on screen once it is opened
const openMoreDialog = async (page) => {
  await page.locator('#more-link').click()
  await expect(page.locator('#more-dialog')).toBeVisible()
}

const verify = async (page, input) => {
  await page.locator('#vc-paste').fill(input);
  await page.getByRole('button', { name: 'Verify', exact: true }).click();
}

const verifyAnother = async (page) => {
  await page.getByRole('button', { name: 'Verify Another' }).click();
}

test.describe('reset clears every to-clear element', () => {

  test('a credential then a failure leaves no text from the credential', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await verify(page, validStatusNoExpiry);
    await expect(page.locator('#more-issued-date')).not.toBeEmpty()

    await verifyAnother(page);
    await verify(page, tampered);
    await expect(page.locator('#error-message')).toContainText("couldn't be verified")

    // the second verification writes only #error-message, so anything left in
    // the other six came from the first credential
    for (const id of populatedByCredential) {
      await expect(page.locator(id)).toBeEmpty()
    }
  });

  test('a failure then a credential renders every field, none suppressed', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await verify(page, tampered);
    await expect(page.locator('#error-message')).toContainText("couldn't be verified")

    await verifyAnother(page);
    await verify(page, validStatusNoExpiry);
    await expect(page.locator('#more-issued-date')).not.toBeEmpty()

    // "nothing suppressed" means on screen, not merely non-empty: each of these
    // sits in a hide-on-reset wrapper that reset() sets to display:none, so
    // asserting text alone would miss a wrapper left hidden
    for (const id of cardFields) {
      await expect(page.locator(id)).not.toBeEmpty()
      await expect(page.locator(id)).toBeVisible()
    }
    await openMoreDialog(page)
    for (const id of dialogFields) {
      await expect(page.locator(id)).not.toBeEmpty()
      await expect(page.locator(id)).toBeVisible()
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

  test('the markup still carries every to-clear element the tests rely on', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').waitFor();

    const found = await discoverToClearIds(page)
    // every name we rely on is still marked to-clear; extras are fine and are
    // picked up by the tests below without being listed here
    for (const id of knownToClearIds) {
      expect(found, `${id} no longer carries class="to-clear"`).toContain(id)
    }
  });

  test('an unfixable failure leaves nothing behind in any to-clear element', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await verify(page, tampered);
    // #31 puts an unfixable failure on the card, as a title and a detail
    await expect(page.locator('#error-title')).not.toBeEmpty()
    await expect(page.locator('#error-message')).not.toBeEmpty()

    await verifyAnother(page);
    await verify(page, validStatusNoExpiry);
    await expect(page.locator('#more-issued-date')).not.toBeEmpty()

    // the credential populates the six card fields and none of the error ones,
    // so any error text still present was carried over
    await expect(page.locator('#error-title')).toBeEmpty()
    await expect(page.locator('#error-message')).toBeEmpty()
  });

  test('a fixable failure leaves nothing behind in any to-clear element', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    // #31 keeps a malformed paste beside the input rather than on the card, so
    // this populates #input-error-text -- the one element no test reached.
    //
    // This asserts the user-facing behaviour, not the mechanism: the component
    // clears this element twice over, via clearInputError() and via reset()'s
    // .to-clear sweep. Removing either one on its own keeps this test green
    // (both mutations verified), so it is the canary above that guards the
    // class. Kept because the behaviour is worth pinning regardless of which
    // path delivers it -- if both are ever dropped, this is what fails.
    await verify(page, 'something that is not a credential');
    await expect(page.locator('#input-error-text')).not.toBeEmpty()

    await verify(page, validStatusNoExpiry);
    await expect(page.locator('#more-issued-date')).not.toBeEmpty()

    await expect(page.locator('#input-error-text')).toBeEmpty()
  });

});
