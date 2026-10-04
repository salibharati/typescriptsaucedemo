import { test, expect } from '../../src/fixtures/fixtures.js';
import * as allure from 'allure-js-commons';
import { TODOS } from '../../src/data/todos.js';

/**
 * Visual regression tests using Playwright's built-in snapshot comparison.
 * Baselines live next to this spec (todo.visual.spec.ts-snapshots/).
 *
 * Run locally:
 *   npm run test:visual            # compare against baselines
 *   npm run test:visual:update     # (re)generate baselines
 *
 * Element-level screenshots are used (not full page) to stay stable across
 * viewport/scrollbar differences, and animations are disabled via config.
 */
test.beforeEach(async () => {
  await allure.parentSuite('Visual Regression');
  await allure.epic('Quality Engineering');
  await allure.feature('TodoMVC snapshots');
  await allure.owner('automai');
});

test.describe('TodoMVC - visual regression', () => {
  test('empty app matches baseline', async ({ page }) => {
    await page.goto('/todomvc');
    await expect(page.locator('.todoapp')).toHaveScreenshot('todo-empty.png');
  });

  test('populated list matches baseline', async ({ todoPage, page }) => {
    await todoPage.addTodos(TODOS);
    await todoPage.toggleByTitle(TODOS[0]);
    await expect(page.locator('.todoapp')).toHaveScreenshot(
      'todo-populated.png',
    );
  });
});
