import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/**
 * Lightweight web-UI checks against the public Playwright docs site.
 * Shows navigation, role-based locators and search interaction.
 */
test.beforeEach(async () => {
  await allure.parentSuite('Web UI');
  await allure.epic('Quality Engineering');
  await allure.feature('playwright.dev');
  await allure.owner('automai');
});

test.describe('playwright.dev', () => {
  test.use({ baseURL: 'https://playwright.dev' });

  test('home page loads with hero call-to-action', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('navigates to the Docs intro page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
    await expect(
      page.getByRole('heading', { name: 'Installation' }),
    ).toBeVisible();
  });
});
