import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

// The card used to be a fixed 380x450. Two consequences, both tested here:
// the bottom gap was only whatever was left over, and the card could not
// shrink into a narrow viewport.
const gapBelowCTA = (page) => page.evaluate(() => {
  const host = document.querySelector('veri-good'), sr = host.shadowRoot
  const hb = host.getBoundingClientRect()
  const btn = sr.querySelector('#verifyAnotherBtn') ?? sr.querySelector('#verifyBtn')
  const br = btn.getBoundingClientRect()
  return { gap: Math.round(hb.bottom - br.bottom), overflows: br.bottom > hb.bottom }
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
    await expect(page.locator('#error-message')).toBeVisible()

    const { gap, overflows } = await gapBelowCTA(page)
    expect(overflows).toBe(false)
    expect(gap).toBeGreaterThanOrEqual(16)
  });

  test('the card grows rather than crushing its contents', async ({ page }) => {
    await page.goto(`${baseUrl}`);
    await page.addStyleTag({ content: 'body { font-family: system-ui, sans-serif }' })
    const initial = await page.evaluate(() =>
      Math.round(document.querySelector('veri-good').getBoundingClientRect().height))

    await page.locator('#vc-paste').fill('something that is not a credential');
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page.locator('#error-message')).toBeVisible()

    const errored = await page.evaluate(() =>
      Math.round(document.querySelector('veri-good').getBoundingClientRect().height))
    // taller content means a taller card, not a squeezed one
    expect(errored).toBeGreaterThan(initial)
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
