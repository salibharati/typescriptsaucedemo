import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

type Filter = 'All' | 'Active' | 'Completed';

/**
 * Page Object for the Playwright TodoMVC demo app.
 * https://demo.playwright.dev/todomvc
 */
export class TodoPage extends BasePage {
  readonly path = '/todomvc';

  private readonly newTodo: Locator;
  private readonly items: Locator;
  private readonly counter: Locator;

  constructor(page: Page) {
    super(page);
    this.newTodo = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
    this.counter = page.locator('.todo-count');
  }

  async addTodo(title: string): Promise<void> {
    await this.fillAndEnter(this.newTodo, title);
  }

  async addTodos(titles: readonly string[]): Promise<void> {
    for (const title of titles) await this.addTodo(title);
  }

  async toggleByTitle(title: string): Promise<void> {
    await this.itemByTitle(title).getByRole('checkbox').check();
  }

  async filterBy(filter: Filter): Promise<void> {
    await this.page.getByRole('link', { name: filter }).click();
  }

  private itemByTitle(title: string): Locator {
    return this.items.filter({ hasText: title });
  }

  // --- assertions -----------------------------------------------------------

  async expectVisibleTodos(titles: readonly string[]): Promise<void> {
    await expect(this.items).toHaveText([...titles]);
  }

  async expectCount(n: number): Promise<void> {
    await expect(this.items).toHaveCount(n);
  }

  async expectRemaining(n: number): Promise<void> {
    await expect(this.counter).toHaveText(
      `${n} item${n === 1 ? '' : 's'} left`,
    );
  }

  async expectCompleted(title: string): Promise<void> {
    await expect(this.itemByTitle(title)).toHaveClass(/completed/);
  }
}
