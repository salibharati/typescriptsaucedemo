import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';

/**
 * Central Playwright configuration.
 * - E2E (SauceDemo) auth is set up once per browser and reused via storageState.
 * - API / GraphQL suites call their services directly (no browser).
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        environmentInfo: {
          Project: 'Playwright TypeScript Framework',
          Framework: 'Playwright + TypeScript',
          Owner: 'automai',
          Node: process.version,
          OS: `${process.platform} ${process.arch}`,
        },
        categories: [
          { name: 'Ignored / skipped', matchedStatuses: ['skipped'] },
          { name: 'Product defects', matchedStatuses: ['failed'] },
          { name: 'Test defects (broken)', matchedStatuses: ['broken'] },
          {
            name: 'Outdated visual baseline',
            matchedStatuses: ['failed'],
            messageRegex: '.*[Ss]creenshot comparison failed.*',
          },
        ],
      },
    ],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://demo.playwright.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    // Auth setup: logs in once and saves the session (storageState).
    // One setup per browser so each matrix job only needs its own browser
    // installed (CI installs a single browser per job).
    {
      name: 'setup-chromium',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: SAUCEDEMO_URL },
    },
    {
      name: 'setup-firefox',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Firefox'], baseURL: SAUCEDEMO_URL },
    },
    {
      name: 'setup-webkit',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Safari'], baseURL: SAUCEDEMO_URL },
    },

    // Functional projects (run in CI). Visual + setup specs are excluded;
    // visual snapshots are OS-specific and would break a cross-platform matrix.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup-chromium'],
      testIgnore: [/visual\//, /.*\.setup\.ts/],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup-firefox'],
      testIgnore: [/visual\//, /.*\.setup\.ts/],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup-webkit'],
      testIgnore: [/visual\//, /.*\.setup\.ts/],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      dependencies: ['setup-chromium'],
      testIgnore: [/(api|visual)\//, /.*\.setup\.ts/],
    },

    // Visual regression project (run locally: `npm run test:visual`).
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /visual\//,
    },
  ],
});
