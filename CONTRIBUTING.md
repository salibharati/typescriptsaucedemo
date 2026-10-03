# Contributing

Thanks for your interest in improving this framework. This guide keeps changes consistent and the pipeline green.

## Prerequisites

- Node.js 20+
- Java 8+ (only needed to generate the Allure report locally)

## Setup

```bash
npm install
npx playwright install
```

## Development workflow

1. Create a branch from `main`: `git checkout -b feat/short-description`.
2. Make your change with a matching test.
3. Run the relevant suite locally (see scripts in the README).
4. Run the quality gate before pushing:
   ```bash
   npm run validate   # type-check + ESLint + Prettier
   ```
5. Open a pull request against `main`.

A Husky pre-commit hook auto-formats and lints staged files and type-checks the
project, so most issues are caught before they reach CI.

## Conventions

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `ci:`, `docs:`, `test:`, `refactor:`, `chore:`).
- **Locators** use user-facing roles / test IDs (`getByRole`, `getByTestId`), not brittle CSS/XPath.
- **Assertions** use Playwright's web-first `expect`; no manual `waitForTimeout`.
- **Page logic** lives in Page Objects under `src/pages`; specs stay declarative.
- **Test data** lives in `src/data`; **fixtures** in `src/fixtures`.
- **Tags** `@smoke` / `@regression` are added to new tests where relevant.

## Adding a test suite

- Place specs under `tests/<area>` (`e2e`, `api`, `web`, `a11y`, `visual`).
- Add the Allure labels in a `test.beforeEach` (`parentSuite`, `epic`, `feature`, `owner`)
  so the report groups it correctly.

## CI

Every push/PR runs: quality gate → cross-browser matrix (Chromium, Firefox, WebKit).
Pushes to `main` also publish the Allure report to GitHub Pages.

## Reporting issues

Use the issue templates (bug report / feature request) and include reproduction
steps, expected vs. actual behaviour, and environment details.
