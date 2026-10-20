import { defineConfig, devices } from '@playwright/test';

// BASE_URL can be overridden: BASE_URL=https://other-host/_v5/ npm test
// NOTE: trailing slash matters, relative paths in tests are resolved against it.
const BASE_URL = process.env.BASE_URL ?? 'https://demo.ozcart.com/_v5/';
const API_URL = process.env.API_URL ?? 'https://petstore.swagger.io/v2/';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // no retries on purpose: failures must be investigated, not hidden
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: BASE_URL },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },
  ],
});
