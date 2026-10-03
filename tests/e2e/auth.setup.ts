import { test as setup } from '@playwright/test';
import { LoginPage } from '../../src/pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../src/pages/saucedemo/InventoryPage.js';
import { VALID_USER } from '../../src/data/users.js';

/**
 * Authentication setup: log in once and persist the session to disk.
 * The authenticated suites reuse this state instead of logging in per test,
 * which is faster and mirrors how real suites are structured.
 */
const authFile = '.auth/user.json';

setup('authenticate as standard_user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(VALID_USER.username, VALID_USER.password);
  await new InventoryPage(page).expectLoaded();
  await page.context().storageState({ path: authFile });
});
