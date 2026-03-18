import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directory where tests are located
  testDir: './tests',

  // Run tests sequentially (more stable with Auth0)
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 1,

  // Single worker for stability
  workers: 1,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  // Global test settings
  use: {
    baseURL: 'https://tools.pre.plat.mnvop.net',
    userAgent: 'hly--dev--go',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },

  // Test timeout
  timeout: 60_000,

  // Expect timeout
  expect: {
    timeout: 10_000,
  },

  // Projects
  projects: [
    // Setup: handles manual authentication
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        storageState: undefined,
      },
    },

    // Main tests: reuse saved auth session
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