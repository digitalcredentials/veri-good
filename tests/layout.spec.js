import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';
const tampered = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/ed25519/didKey/legacy-noStatus-noExpiry-tampered.json"
const validStatusNoExpiry = "https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json"

// The card used to be a fixed 380x450. Two consequences, both tested here:
// the bottom gap was only whatever was left over, and the card could not
// shrink into a narrow viewport.
const gapBelowCTA = (page) => page.evaluate(() => {
  const host = document.querySelector('veri-good'), sr = host.shadowRoot
  const hb = host.getBoundingClientRect()
  // both buttons are always in the DOM and one is display:none, so pick the
  // visible one -- picking the first that *exists* measures a zero rect and
  // makes every assertion below vacuously true
  const visible = el => el && getComputedStyle(el).display !== 'none'
  const btn = [sr.querySelector('#verifyAnotherBtn'), sr.querySelector('#verifyBtn')].find(visible)
  if (!btn) return { gap: null, overflows: null, found: false }
  const br = btn.getBoundingClientRect()
  return { gap: Math.round(hb.bottom - br.bottom), overflows: br.bottom > hb.bottom, found: true }
})

test.describe('card layout', () => {

  // The component inherits font-family from the page embedding it, so the
  // same copy wraps to a different number of lines in different hosts. Under
  // a sans-serif host font the generic error line wraps to two, which against
  // a fixed height left 11px under the CTA where every other screen had 24-28.
  test('the CTA keeps its breathing room when the host font makes copy wrap', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.addStyleTag({ content: 'body { font-family: system-ui, sans-serif }' })
    await page.locator('#vc-paste').fill('something that is not a credential');
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    // a fixable failure renders beside the field, which is what grows the card
    await expect(page.locator('#input-error')).toBeVisible()

    const { gap, overflows, found } = await gapBelowCTA(page)
    expect(found).toBe(true)
    expect(overflows).toBe(false)
    expect(gap).toBeGreaterThanOrEqual(16)
  });

  // Neither error path outgrows 450px with today's copy -- the alert replaces
  // the input, so it is shorter, not taller. min-height still has to hold the
  // guarantee, because copy changes and embedders set their own fonts. Force
  // the case rather than asserting growth that today's content never triggers.
  test('the card grows when its content outgrows the minimum', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(tampered);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#error-title')).toBeVisible()

    const before = await page.evaluate(() =>
      Math.round(document.querySelector('veri-good').getBoundingClientRect().height))
    expect(before).toBe(450)

    // a longer reason than any we ship today, which a new failure mode or a
    // translation could easily produce
    await page.evaluate(() => {
      document.querySelector('veri-good').shadowRoot.querySelector('#error-message')
        .textContent = 'The credential could not be verified. '.repeat(12)
    })

    const after = await gapBelowCTA(page)
    const grown = await page.evaluate(() =>
      Math.round(document.querySelector('veri-good').getBoundingClientRect().height))

    expect(grown).toBeGreaterThan(before)   // grew rather than squeezing
    expect(after.overflows).toBe(false)     // and the CTA came with it
    expect(after.gap).toBeGreaterThanOrEqual(16)
  });

  test('the CTA clears the bottom edge at every width', async ({ page }) => {
    for (const width of [900, 560, 420, 360]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(`${baseUrl}`);
      await page.addStyleTag({ content: 'body { font-family: system-ui, sans-serif }' })
      await page.locator('#vc-paste').fill('something that is not a credential');
      await page.getByRole('button', { name: 'Verify', exact: true }).click();
      await expect(page.locator('#input-error')).toBeVisible()

      const { gap, overflows, found } = await gapBelowCTA(page)
      expect(found, `no visible CTA at ${width}px`).toBe(true)
      expect(overflows, `CTA overflows at ${width}px`).toBe(false)
      expect(gap, `CTA cramped at ${width}px`).toBeGreaterThanOrEqual(16)
    }
  });

  // The reflow test below only exercised the input screen, which is how a
  // clipped success screen got through: letting the card shrink without
  // shrinking #result-list's fixed 4em paddings pushed the check messages
  // past the card edge, where contain: content paints them away. Losing text
  // is worse than the sideways scroll it replaced.
  test('the success screen fits the card at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.goto(`${baseUrl}`);
    await page.locator('#vc-paste').fill(validStatusNoExpiry);
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#sig-message')).toHaveText('Signature is valid.')

    // wait for every check to land, so the placeholders -- which are longer
    // than the results and therefore the real worst case -- are measured too
    await expect(page.locator('#rev-message')).toHaveText('Has not been revoked')

    const overflowing = await page.evaluate(() => {
      const host = document.querySelector('veri-good'), sr = host.shadowRoot
      const hb = host.getBoundingClientRect()
      return ['#sig-message','#exp-message','#rev-message',
              '#holder-name','#cred-name','#issuer-name']
        .filter(sel => {
          const el = sr.querySelector(sel); if (!el) return false
          const r = el.getBoundingClientRect()
          // a hidden row reports a zero rect at 0,0, which is not an overflow
          if (r.width === 0 && r.height === 0) return false
          return r.right > hb.right + 0.5 || r.left < hb.left - 0.5
        })
    })
    expect(overflowing).toEqual([])
  });

  // WCAG 2.1 SC 1.4.10 Reflow: content must not require scrolling in two
  // dimensions at 320px.
  test('reflows to 320px without scrolling sideways', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto(`${baseUrl}`);
    const r = await page.evaluate(() => ({
      cardW: Math.round(document.querySelector('veri-good').getBoundingClientRect().width),
      scrollW: document.documentElement.scrollWidth,
      viewportW: window.innerWidth,
    }))
    expect(r.scrollW).toBeLessThanOrEqual(r.viewportW)
    expect(r.cardW).toBeLessThanOrEqual(r.viewportW)
  });

});
