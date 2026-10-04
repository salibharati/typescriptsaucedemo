import { test, expect } from '../../src/fixtures/fixtures.js';
import * as allure from 'allure-js-commons';

/**
 * Automated accessibility checks with axe-core (WCAG 2.0/2.1 A & AA).
 * Automated scans catch a meaningful share of WCAG issues; they complement
 * - they do not replace - manual and assistive-technology testing.
 *
 * Critical violations fail the build; every violation (any impact) is
 * attached to the report for triage and trend tracking.
 */
const BLOCKING_IMPACTS = new Set(['critical']);

test.beforeEach(async () => {
  await allure.parentSuite('Accessibility');
  await allure.epic('Quality Engineering');
  await allure.feature('WCAG (axe-core)');
  await allure.owner('automai');
});

test.describe('Accessibility @regression', () => {
  test('TodoMVC has no critical WCAG violations', async ({
    todoPage,
    makeAxeBuilder,
  }, testInfo) => {
    await todoPage.addTodo('Audit accessibility');

    const results = await makeAxeBuilder().analyze();

    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const blocking = results.violations.filter((v) =>
      BLOCKING_IMPACTS.has(v.impact ?? ''),
    );
    expect(blocking, JSON.stringify(blocking.map((v) => v.id))).toEqual([]);
  });
});
