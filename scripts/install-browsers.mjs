// Playwright's browsers are a separate download, so `npm ci` on its own does
// not leave this repo able to run `npm test`. Install Chromium after install.
//
// npm also runs this for anyone who installs this package as a *dependency*,
// where @playwright/test is absent — it is a devDependency — and the install
// would fail on a missing `playwright` bin. So check for it first, anchored to
// the install root: require.resolve() walks up the tree and would happily find
// a consumer's own hoisted copy, which is the one case this guard exists for.
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

if (!existsSync('node_modules/@playwright/test')) {
  process.exit(0)
}

const { status } = spawnSync('playwright', ['install', 'chromium'], {
  stdio: 'inherit',
  shell: true,
})
process.exit(status ?? 1)
