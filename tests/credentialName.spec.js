import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sampleVC } from './testcred.js';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:8080';

// Carries the title only on the achievement, with no top-level `name`.
const achievementNameOnly = readFileSync(
  fileURLToPath(new URL('./fixtures/achievementNameOnly.json', import.meta.url)),
  'utf8'
);

// Carries a top-level `name` as well as an achievement name.
const bothNames = readFileSync(
  fileURLToPath(new URL('./fixtures/LCWExperience.json', import.meta.url)),
  'utf8'
);

// The demo page's own template doesn't know the issuer of the locally signed
// fixture, so register a list covering every issuer these tests use.
const issuerDids = {
  'did:key:z6MkvDqGT54cXesYGvABpF1UapVNwjCqRcafi4Px6Thv5T3Z': {
    issuerName: 'Department of Cartography',
    url: 'https://cartography.uni.edu'
  },
  'did:key:z6MknNQD1WHLGGraFi6zcbGevuAgkVfdyCdtZnQTGWVVvR5Q': {
    issuerName: 'Department of History',
    url: 'https://history.uni.edu'
  },
  'did:key:z6MktL8XGbuYv5f7hwf6hVyJkJWynNtNhcsXFYe9NJzjKHkW': {
    issuerName: 'Digital Credentials Consortium',
    url: 'https://dcconsortium.org'
  }
};

const open = async (page) => {
  await page.goto(`${baseUrl}`);
  await page.locator('#vc-paste').waitFor();
  await page.evaluate(
    (dids) => document.querySelector('veri-good').setIssuerDids(dids),
    issuerDids
  );
};

const verify = async (page, credential) => {
  await page.locator('#vc-paste').fill(credential);
  await page.getByRole('button', { name: 'Verify', exact: true }).click();
};

test.describe('credential title', () => {

  test('falls back to the achievement name when there is no top-level name', async ({ page }) => {
    await open(page);
    await verify(page, achievementNameOnly);
    await expect(page.locator('#cred-name')).toHaveText('Advanced Cartography');
    await expect(page.getByText('was awarded a')).toBeVisible();
    await expect(page.locator('#issuer-name')).toHaveText('Department of Cartography');
  });

  test('uses the top-level name when there is one', async ({ page }) => {
    await open(page);
    await verify(page, bothNames);
    await expect(page.locator('#cred-name')).toHaveText('LCW Experience Badge');
    await expect(page.getByText('was awarded a')).toBeVisible();
  });

  test('suppresses the title line and its label when there is no title at all', async ({ page }) => {
    await open(page);
    await verify(page, JSON.stringify(sampleVC));
    await expect(page.locator('#holder-name')).toHaveText('James Chartrand');
    await expect(page.locator('#cred-name')).toBeHidden();
    await expect(page.getByText('was awarded a')).toBeHidden();
    // the other label is unaffected
    await expect(page.getByText('by the')).toBeVisible();
    await expect(page.locator('#issuer-name')).toHaveText('Department of History');
  });

  test('leaves no trace of a previous title when verifying an untitled credential next', async ({ page }) => {
    await open(page);
    await verify(page, bothNames);
    await expect(page.locator('#cred-name')).toHaveText('LCW Experience Badge');

    await page.getByRole('button', { name: 'Verify Another' }).click();
    await verify(page, JSON.stringify(sampleVC));

    await expect(page.locator('#holder-name')).toHaveText('James Chartrand');
    await expect(page.locator('#cred-name')).toBeHidden();
    await expect(page.locator('#cred-name')).toHaveText('');
    await expect(page.getByText('was awarded a')).toBeHidden();
  });
});
