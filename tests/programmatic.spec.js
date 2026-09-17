import { test, expect } from '@playwright/test';

const validStatusNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"
const tampered = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/ed25519/didKey/legacy-noStatus-noExpiry-tampered.json"
const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

// Every other spec in this repo drives the component the way the demo page
// does: type into #vc-paste, click Verify. That is only one of the two ways
// the component is used. An embedder can also call the element's own method:
//
//   document.querySelector('veri-good').verify(vc)
//
// which is how lcw-front-end drives it (SpaceBrowserPage.tsx). Nothing here
// exercised that path, so the public API was free to break without a single
// test noticing. These tests call it and nothing else.

// Drive the component the way an embedder does, never touching the textarea.
const verifyProgrammatically = async (page, vc) =>
  page.evaluate((v) => document.querySelector('veri-good').verify(v), vc)

const open = async (page) => {
  await page.goto(`${baseUrl}`);
  // the method lives on the upgraded element, so wait for the shadow markup
  await page.locator('#vc-paste').waitFor();
}

test.describe('the programmatic verify() entry point', () => {

  test('verifies a credential with nothing typed into the paste box', async ({ page }) => {
    await open(page)

    // nobody has typed anything: the call itself is the whole input
    await expect(page.locator('#vc-paste')).toHaveValue('')

    await verifyProgrammatically(page, validStatusNoExpiry)

    await expect(page.locator('#sig-message')).toHaveText('Signature is valid.')
    await expect(page.locator('#result-container')).toBeVisible()
  });

  test('accepts a call as soon as veri-good-is-ready has fired', async ({ page }) => {
    // The component dispatches veri-good-is-ready from connectedCallback, and
    // lcw-front-end relies on being able to call verify() the moment it sees
    // that event. Register the listener before any script runs, or the event
    // has already been dispatched by the time the page settles.
    await page.addInitScript(() => {
      window.__readyFired = false
      document.addEventListener('veri-good-is-ready', () => { window.__readyFired = true })
    })

    await page.goto(`${baseUrl}`);
    await expect.poll(() => page.evaluate(() => window.__readyFired)).toBe(true)

    // the event is the embedder's signal that the API is usable, so a call
    // made on the strength of it alone has to work
    await verifyProgrammatically(page, validStatusNoExpiry)
    await expect(page.locator('#sig-message')).toHaveText('Signature is valid.')
  });

  test('a failure it cannot fix is announced on the card, not beside the input', async ({ page }) => {
    await open(page)
    await verifyProgrammatically(page, tampered)

    // verification ran and failed: the embedder's user cannot retype their way
    // out of this, so it belongs on the card
    await expect(page.locator('#error-container')).toBeVisible()
    await expect(page.locator('#error-title')).toHaveText("Couldn't verify this credential")
  });

  // Documents current behaviour rather than endorsing it. When the credential
  // never parses, displayInputError puts the message beside the textarea and
  // calls showElement('#input-container'), which writes an INLINE display.
  //
  // For a pasting user that is right: the message sits next to the box holding
  // what they typed. For an embedder that injected the credential itself there
  // is nothing for the user to correct, and the inline style would override a
  // host stylesheet that hid the box. lcw-front-end renders the element bare
  // and shows the full default UI, so nothing is revealed there today -- but
  // an embedder that does hide the input would be overridden.
  //
  // If that presentation is changed, this test should fail and be updated. It
  // exists so the decision is visible rather than discovered.
  test('a failure it could fix falls back to the input, injected value and all', async ({ page }) => {
    await open(page)
    await verifyProgrammatically(page, 'this is not a credential')

    await expect(page.locator('#input-error-text'))
      .toHaveText("The credential you provided couldn't be processed.")
    await expect(page.locator('#input-container')).toBeVisible()
    // the injected credential is left in the box for the user to correct
    await expect(page.locator('#vc-paste')).toHaveValue('this is not a credential')
  });

});
