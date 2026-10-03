import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { TodoPage } from '../pages/TodoPage.js';

/**
 * Custom fixtures expose ready-to-use building blocks to the tests,
 * so specs stay declarative and free of setup boilerplate.
 */
type Fixtures = {
  todoPage: TodoPage;
  /**
   * A pre-configured axe-core builder scoped to WCAG 2.0/2.1 A & AA.
   * One shared factory keeps accessibility config in a single place.
   */
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },

  makeAxeBuilder: async ({ page }, use) => {
    const make = () =>
      new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
      ]);
    await use(make);
  },
});

export { expect } from '@playwright/test';
