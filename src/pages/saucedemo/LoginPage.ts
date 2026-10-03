import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage.js';

/** SauceDemo login page - https://www.saucedemo.com */
export class LoginPage extends BasePage {
  readonly path = '/';

  private readonly username: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;
  private readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.locator('#user-name');
    this.password = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.error = page.locator('[data-test="error"]');
  }

  async login(user: string, pass: string): Promise<void> {
    await expect(this.username).toBeVisible({ timeout: 15000 });
    await expect(this.password).toBeVisible({ timeout: 15000 });
    await expect(this.loginButton).toBeVisible({ timeout: 15000 });

    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.error).toContainText(message);
  }
}
