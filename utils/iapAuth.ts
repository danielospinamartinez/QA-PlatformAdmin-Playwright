// utils/iapAuth.ts
import { BrowserContext, Page } from '@playwright/test';
import { execSync } from 'child_process';

const SA_EMAIL = process.env.SA_EMAIL || 'automation-qa@hly--platf--pre--98.iam.gserviceaccount.com';
const IAP_CLIENT_ID = process.env.IAP_CLIENT_ID || '113370093374-km1ksg7rot2igmvtbrm35npuk1grrc2v.apps.googleusercontent.com';

export function generateIapToken(): string {
  try {
    const token = execSync(
      `gcloud auth print-identity-token \
        --audiences="${IAP_CLIENT_ID}" \
        --impersonate-service-account="${SA_EMAIL}" \
        --include-email`,
      { encoding: 'utf-8' }
    ).trim();
    return token;
  } catch (error) {
    throw new Error(
      `Failed to generate IAP token.\n` +
      `Make sure:\n` +
      `  1. gcloud CLI is installed\n` +
      `  2. You are logged in: gcloud auth login\n` +
      `  3. SA_EMAIL and IAP_CLIENT_ID are correct\n` +
      `Error: ${error}`
    );
  }
}

export async function injectIapToken(page: Page): Promise<void> {
  const token = generateIapToken();
  await page.route('**/*', async (route) => {
    const headers = {
      ...route.request().headers(),
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'hly--dev--go',
    };
    await route.continue({ headers });
  });
}

export async function injectIapTokenToContext(context: BrowserContext): Promise<void> {
  const token = generateIapToken();
  await context.route('**/*', async (route) => {
    const headers = {
      ...route.request().headers(),
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'hly--dev--go',
    };
    await route.continue({ headers });
  });
}