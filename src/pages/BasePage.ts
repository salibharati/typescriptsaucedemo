import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Shared behaviour for all page objects.
 * Keeps navigation and common assertions in one place so concrete
 * pages stay focused on their own elements and actions.
 */
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  /** Path relative to the configured baseURL (e.g. '/todomvc'). */
  abstract readonly path: string;

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectTitleContains(text: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(text);
  }

  protected async fillAndEnter(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
    await locator.press('Enter');
  }
}
