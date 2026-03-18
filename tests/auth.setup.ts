// tests/auth.setup.ts
// This file handles authentication ONCE and saves the session
// so all other tests can reuse it without logging in again

import { test as setup, chromium } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../fixtures/auth.json');
const URL_APP = 'https://tools.pre.plat.mnvop.net/platform-admin/modules/discounts';

setup.setTimeout(300_000);

setup('authenticate manually', async ({ }) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'hly--dev--go',
  });

  const page = await context.newPage();

  await page.goto(URL_APP, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  console.log('');
  console.log('⚠️  Ingresa tu cuenta corporativa en el browser');
  console.log('⚠️  Cuando veas la tabla de Discounts, el setup continuará automáticamente');
  console.log('');

  await page.waitForSelector('text=Discounts and vouchers', { timeout: 240_000 });
  console.log('✅ Login completado!');

  await context.storageState({ path: authFile });
  console.log('💾 Sesión guardada!');
  await browser.close();
});