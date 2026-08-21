# Playwright Automation Framework Context

> Entry point for Claude Code sessions: `CLAUDE.md` (repo root). Binding rules: `.specify/memory/constitution.md`.

Language: TypeScript (strict, CommonJS). Tool: Playwright Test. Architecture: Page Object Model + custom fixtures.

## Directory map (source of truth)

| Path                                     | Purpose                                                                                                                                                                                                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `playwright.config.ts`                   | Projects (chromium/firefox/webkit + `mobile-chrome` Pixel 7 / `mobile-safari` iPhone 15 scoped to `tests/shop`, each with its `setup:*`), `unit`, `api`; reporters (list, html, json, allure), `use.baseURL` from env, traces/screenshots/videos on failure, CI retries.       |
| `config/environment.ts`                  | `loadEnvironment()`: loads `.env` (secrets, git-ignored) then `config/environments/<TEST_ENV>.env` (BASE_URL). `ENV.baseUrl`, `ENV.environment`.                                                                                                                               |
| `config/environments/*.env`              | Per-environment non-secret values: `dev`, `uat` (default), `pre-prod`, `prod`.                                                                                                                                                                                                 |
| `config/executionConfig.ts`              | `EXECUTION_CONFIG` (name, version from package.json, browser, author).                                                                                                                                                                                                         |
| `fixtures/baseFixture.ts`                | **Import `test`/`expect` from here, not from `@playwright/test`.** Fixtures: `homePage`, `docsPage`, `loginPage`, `secureAreaPage`, `shop.*`, `actions`, `assertion`, `data`, `allure`, `step`, `a11y`, `visual`, `api`.                                                       |
| `fixtures/actionFixture.ts`              | `Actions`: `smartClick`, `smartFill`, `forceClick`, `doubleClick`, `rightClick`, `hover`, `pressKey`, `selectByValue/Label`, `setChecked`, `uploadFile`, `scrollIntoView`, `waitForPageReady`, `waitForVisible/Hidden`.                                                        |
| `fixtures/assertionFixture.ts`           | `Assertions`: hard assertions (delegates to `utilities/assertionUtil`) + `assertion.soft.*` (`utilities/softAssertionUtil`).                                                                                                                                                   |
| `api/`                                   | Typed API layer: `BaseApiClient` (`get/post/put/patch/delete<T>` → `{ response, body }`), `clients/PostsClient`, `clients/UsersClient`, `types.ts`, `createApiClients()`. Exposed by the `api` fixture on its own request context (`API_URL`), usable from browser suites too. |
| `pages/`                                 | `BasePage` (goto relative to baseURL + waitForPageReady), `HomePage`, `DocsPage`. Export new pages from `pages/index.ts` and register them as fixtures.                                                                                                                        |
| `tests/`                                 | `*.spec.ts`. Reference example: `tests/home.spec.ts`.                                                                                                                                                                                                                          |
| `testData/<env>/*.json`                  | Loaded with `data.load<T>("fileName")` (env = `TEST_ENV`).                                                                                                                                                                                                                     |
| `utilities/assertionUtil.ts`             | Static hard assertions (`Assertion.assertVisible`, `assertText`, `assertURL`, API `assertStatus`, …).                                                                                                                                                                          |
| `utilities/softAssertionUtil.ts`         | `expect.soft` wrappers + `assertAll()`.                                                                                                                                                                                                                                        |
| `utilities/clickUtil.ts`, `fillUtil.ts`  | `smartClick` (thin `click` wrapper), `smartFill` (`fill` + auto-retrying `toHaveValue` check). No manual retry loops.                                                                                                                                                          |
| `utilities/waitUtil.ts`                  | `waitForPageReady(page, { loaderSelectors })` — never uses `networkidle`.                                                                                                                                                                                                      |
| `utilities/retryUtil.ts`                 | `retry(action, { retries, delay, actionName })`. Single retry implementation.                                                                                                                                                                                                  |
| `utilities/screenshotUtil.ts`            | `takeScreenshot(page, caseName, stepName)` → `Screenshots/<date>/<case>/NN_step.jpg` + report attachment.                                                                                                                                                                      |
| `utilities/excelUtil.ts`                 | `getTestData(file, sheet)` (rows with `executor=Y`), `writeCell`, `writePolicyNumber`.                                                                                                                                                                                         |
| `utilities/fileUtil.ts`                  | `downloadFile`, `createFolder`.                                                                                                                                                                                                                                                |
| `utilities/scrollUtil.ts`                | `clickWithScroll` for horizontally scrollable containers.                                                                                                                                                                                                                      |
| `utilities/fakerUtil.ts`                 | `FakerUtility` static generators (`@faker-js/faker`).                                                                                                                                                                                                                          |
| `utilities/dataManager.ts`               | Default export used by the `data` fixture.                                                                                                                                                                                                                                     |
| `utilities/dashboardUtil.ts`             | Console execution banner (called from `global-setup.ts`).                                                                                                                                                                                                                      |
| `reporting/allure/`                      | `allureUtil` (epic/feature/story/owner/severity/tag/applyDefaults), `stepUtil`, `environmentWriter`, `defaultMetadata`.                                                                                                                                                        |
| `reporting/email/`, `reporting/zip/`     | `npm run report:email` (needs `EMAIL_FROM/PASSWORD/TO`), `npm run report:zip`.                                                                                                                                                                                                 |
| `global-setup.ts` / `global-teardown.ts` | Banner + report folders / Allure environment + report generation (non-fatal).                                                                                                                                                                                                  |
| `scripts/`                               | `clean-snap-env.sh` (wrapper used by npm test scripts), `send-report.ts`, `zip-reports.ts`.                                                                                                                                                                                    |
| `.github/workflows/playwright.yml`       | CI: `check` → browser/api matrix + visual (Docker) → merged reports. Push/PR to `main`, nightly (Mon–Fri 03:00 UTC) and manual; PR runs are cancelled by newer pushes.                                                                                                         |

Deprecated: `utilities/CommonUtilities.ts` is only a re-export barrel — import from the focused modules instead. There is **no** `utils/` folder.

## npm scripts

`test`, `test:chromium|firefox|webkit|api|unit|a11y|visual` (`test:visual` runs in Docker; `test:visual:update` regenerates baselines; `test:visual:local` is informational only), `test:dev|uat|prod`, `test:ui`, `test:headed`, `typecheck`, `lint`, `lint:fix`, `format`, `format:check`, `check` (typecheck + lint + format, runs in CI), `report`, `allure`, `report:zip`, `report:email`.

## Test template

```ts
import { test, expect } from "../fixtures/baseFixture";

test.describe("Feature", () => {
  test("scenario", async ({ homePage, assertion, data, allure, step, page }) => {
    await allure.feature("Home");
    const td = data.load<{ titlePattern: string }>("home");

    await step("Open home", () => homePage.open());
    await assertion.assertTitle(page, new RegExp(td.titlePattern));
    await assertion.soft.assertVisible(homePage.getStartedLink, "Get started visible");
    assertion.soft.assertAll();
  });
});
```

## Jira traceability

Every spec generated from a story: `test.describe("<Feature> @KEY", …)` and `allure.issue("KEY")` in `beforeEach`. Run with `npm run test:story -- "@KEY"`.

## Rules for generated code

1. Reuse fixtures, page objects and utilities above; do not create parallel helpers.
2. No hard-coded URLs — use `baseURL` (relative `goto`) and `config/environments`.
3. No `networkidle`, no fixed `waitForTimeout` in tests.
4. Locators: prefer `getByRole`/`getByLabel`/`getByTestId` over CSS/XPath.
5. Test data goes in `testData/<env>/`, secrets only in `.env`.
6. TypeScript strict: no `any`, no `require`. Code must pass `npm run check` (ESLint with typescript-eslint + eslint-plugin-playwright, Prettier).
7. Do not modify `playwright.config.ts`, `config/`, CI or secrets without explicit approval.
