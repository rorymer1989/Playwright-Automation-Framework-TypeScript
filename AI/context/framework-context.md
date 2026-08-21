# Playwright Automation Framework Context

Language: TypeScript (strict, CommonJS). Tool: Playwright Test. Architecture: Page Object Model + custom fixtures.

## Directory map (source of truth)

| Path | Purpose |
|---|---|
| `playwright.config.ts` | Projects (chromium/firefox/webkit), reporters (list, html, json, allure), `use.baseURL` from env, traces/screenshots/videos on failure, CI retries. |
| `config/environment.ts` | `loadEnvironment()`: loads `.env` (secrets, git-ignored) then `config/environments/<TEST_ENV>.env` (BASE_URL). `ENV.baseUrl`, `ENV.environment`. |
| `config/environments/*.env` | Per-environment non-secret values: `dev`, `uat` (default), `pre-prod`, `prod`. |
| `config/executionConfig.ts` | `EXECUTION_CONFIG` (name, version from package.json, browser, author). |
| `fixtures/baseFixture.ts` | **Import `test`/`expect` from here, not from `@playwright/test`.** Fixtures: `homePage`, `docsPage`, `actions`, `assertion`, `data`, `allure`, `step`. |
| `fixtures/actionFixture.ts` | `Actions`: `smartClick`, `smartFill`, `waitForPageReady`. |
| `fixtures/assertionFixture.ts` | `Assertions`: hard assertions (delegates to `utilities/assertionUtil`) + `assertion.soft.*` (`utilities/softAssertionUtil`). |
| `pages/` | `BasePage` (goto relative to baseURL + waitForPageReady), `HomePage`, `DocsPage`. Export new pages from `pages/index.ts` and register them as fixtures. |
| `tests/` | `*.spec.ts`. Reference example: `tests/home.spec.ts`. |
| `testData/<env>/*.json` | Loaded with `data.load<T>("fileName")` (env = `TEST_ENV`). |
| `utilities/assertionUtil.ts` | Static hard assertions (`Assertion.assertVisible`, `assertText`, `assertURL`, API `assertStatus`, …). |
| `utilities/softAssertionUtil.ts` | `expect.soft` wrappers + `assertAll()`. |
| `utilities/clickUtil.ts`, `fillUtil.ts` | `smartClick`, `smartFill` (retry + verification). |
| `utilities/waitUtil.ts` | `waitForPageReady(page, { loaderSelectors })` — never uses `networkidle`. |
| `utilities/retryUtil.ts` | `retry(action, { retries, delay, actionName })`. Single retry implementation. |
| `utilities/ActionUtility.ts` | Static helpers (click, fill, select, check, hover, upload, waits). |
| `utilities/screenshotUtil.ts` | `takeScreenshot(page, caseName, stepName)` → `Screenshots/<date>/<case>/NN_step.jpg` + report attachment. |
| `utilities/excelUtil.ts` | `getTestData(file, sheet)` (rows with `executor=Y`), `writeCell`, `writePolicyNumber`. |
| `utilities/fileUtil.ts` | `downloadFile`, `createFolder`. |
| `utilities/scrollUtil.ts` | `clickWithScroll` for horizontally scrollable containers. |
| `utilities/Fakerutility.ts` | `FakerUtility` static generators (`@faker-js/faker`). |
| `utilities/dataManager.ts` | Default export used by the `data` fixture. |
| `utilities/dashboardUtil.ts` | Console execution banner (called from `global-setup.ts`). |
| `reporting/allure/` | `allureUtil` (epic/feature/story/owner/severity/tag/applyDefaults), `stepUtil`, `environmentWriter`, `defaultMetadata`. |
| `reporting/email/`, `reporting/zip/` | `npm run report:email` (needs `EMAIL_FROM/PASSWORD/TO`), `npm run report:zip`. |
| `global-setup.ts` / `global-teardown.ts` | Banner + report folders / Allure environment + report generation (non-fatal). |
| `scripts/` | `clean-snap-env.sh` (wrapper used by npm test scripts), `send-report.ts`, `zip-reports.ts`. |
| `.github/workflows/playwright.yml` | CI: typecheck + tests + artifacts. |

Deprecated: `utilities/CommonUtilities.ts` is only a re-export barrel — import from the focused modules instead. There is **no** `utils/` folder.

## npm scripts

`test`, `test:chromium|firefox|webkit`, `test:dev|uat|prod`, `test:ui`, `test:headed`, `typecheck`, `report`, `allure`, `report:zip`, `report:email`.

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

## Rules for generated code

1. Reuse fixtures, page objects and utilities above; do not create parallel helpers.
2. No hard-coded URLs — use `baseURL` (relative `goto`) and `config/environments`.
3. No `networkidle`, no fixed `waitForTimeout` in tests.
4. Locators: prefer `getByRole`/`getByLabel`/`getByTestId` over CSS/XPath.
5. Test data goes in `testData/<env>/`, secrets only in `.env`.
6. TypeScript strict: no `any`, no `require`.
7. Do not modify `playwright.config.ts`, `config/`, CI or secrets without explicit approval.
