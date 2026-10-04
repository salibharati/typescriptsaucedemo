import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LoginPage } from '../../src/pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../src/pages/saucedemo/InventoryPage.js';
import { VALID_USER, LOGIN_SCENARIOS } from '../../src/data/users.js';

/**
 * Authentication tests against SauceDemo. The negative cases are data-driven
 * from a single source of truth (LOGIN_SCENARIOS), so adding a case is a
 * one-line data change - no new test code.
 *
 * These run with a fresh (unauthenticated) context.
 */
test.use({ baseURL: 'https://www.saucedemo.com' });

test.beforeEach(async () => {
  await allure.parentSuite('End-to-End (UI)');
  await allure.epic('Quality Engineering');
  await allure.feature('SauceDemo - Authentication');
  await allure.owner('automai');
});

test.describe('SauceDemo login', { tag: '@regression' }, () => {
  test(
    'valid credentials reach the inventory',
    { tag: '@smoke' },
    async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login(VALID_USER.username, VALID_USER.password);
      await new InventoryPage(page).expectLoaded();
    },
  );

  for (const scenario of LOGIN_SCENARIOS) {
    test(`rejects ${scenario.name}`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login(scenario.username, scenario.password);
      await login.expectError(scenario.error);
    });
  }

  test('locks the account after repeated failed logins', async () => {
    // SauceDemo's public demo account does not lock after repeated failures.
    // eslint-disable-next-line playwright/no-skipped-test -- unsupported by the public demo app
    test.skip(
      true,
      'Not supported by the public SauceDemo app; requires an app with lockout behavior',
    );
  });
});
