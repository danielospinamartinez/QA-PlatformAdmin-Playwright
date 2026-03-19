import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,

  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  use: {
    baseURL: 'https://tools.pre.plat.mnvop.net',
    userAgent: 'hly--dev--go',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },

  timeout: 60_000,
  expect: { timeout: 10_000 },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        storageState: undefined,
        channel: 'chrome',
      },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        userAgent: 'hly--dev--go',
        storageState: 'fixtures/auth.json',
      },
      dependencies: ['setup'],
    },
  ],

  outputDir: 'test-results/',
});