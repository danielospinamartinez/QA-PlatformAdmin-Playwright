// tests/auth.setup.ts
// This file handles authentication ONCE and saves the session
// so all other tests can reuse it without logging in again

import { test as setup } from '@playwright/test';

// ─── OPTION 1: Manual Authentication (ACTIVE) ──────────────────────────────
// Run this command to renew the session manually:
// npm run auth
// Then log in, wait for Discounts page and close the browser.

setup('authenticate manually', async ({ }) => {
  console.log('✅ Using existing auth.json session');
  console.log('💡 Session expired? Run: npm run auth');
});

// ─── OPTION 2: IAP Service Account (PENDING - waiting for DevOps) ──────────
// Uncomment this block when DevOps provides Auth0 credentials for the SA
//
// import { chromium } from '@playwright/test';
// import { execSync } from 'child_process';
// import path from 'path';
//
// const authFile = path.join(__dirname, '../../fixtures/auth.json');
// const SA_EMAIL = 'automation-qa@hly--platf--pre--98.iam.gserviceaccount.com';
// const IAP_CLIENT_ID = '113370093374-km1ksg7rot2igmvtbrm35npuk1grrc2v.apps.googleusercontent.com';
// const URL_APP = 'https://tools.pre.plat.mnvop.net/platform-admin/modules/discounts';
//
// const TOKEN = execSync(
//   `gcloud auth print-identity-token --audiences="${IAP_CLIENT_ID}" --impersonate-service-account="${SA_EMAIL}" --include-email`,
//   { encoding: 'utf-8', timeout: 30000 }
// ).trim();
//
// setup.setTimeout(120_000);
//
// setup('authenticate with IAP Service Account', async ({ }) => {
//   const browser = await chromium.launch({ headless: true });
//   const context = await browser.newContext({ userAgent: 'hly--dev--go' });
//   const page = await context.newPage();
//
//   await context.route('**/*', async (route) => {
//     const url = route.request().url();
//     if (['onlinewebfonts.com', 'fonts.googleapis', 'ilert.io'].some(d => url.includes(d))) {
//       await route.abort();
//       return;
//     }
//     if (['mnvop.net', 'holafly', 'auth0.com'].some(d => url.includes(d))) {
//       await route.continue({
//         headers: { ...route.request().headers(), 'Authorization': `Bearer ${TOKEN}`, 'User-Agent': 'hly--dev--go' },
//       });
//     } else {
//       await route.continue();
//     }
//   });
//
//   await page.goto(URL_APP, { waitUntil: 'domcontentloaded', timeout: 60_000 });
//   await page.waitForSelector('#root > *', { timeout: 30_000 });
//   await context.storageState({ path: authFile });
//   await browser.close();
// });