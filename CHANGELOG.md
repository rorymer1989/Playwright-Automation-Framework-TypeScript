# Changelog

All notable changes to this project are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [1.6.0] — 2026-08-21

### Added

- **Leveled logger** (`utilities/logger.ts`) — `LOG_LEVEL=silent|error|warn|info|debug` (default `info`) for all framework output (banner, setup/teardown, reporting, retry, data loading, scripts). `LOG_LEVEL=warn` leaves only the test runner's own output. 4 unit tests.
- **Dependabot** (`.github/dependabot.yml`) — weekly grouped updates for npm (playwright / lint / types groups) and GitHub Actions; TypeScript ≥ 6 ignored until `typescript-eslint` supports it.
- `.vscode/settings.json` — workspace TypeScript, Prettier on save, ESLint flat config.

### Changed

- **Assertions are `test.step`s** — every `Assertion.*` / `assertion.*` call is a boxed step: its intent shows in the HTML/Allure report and trace viewer instead of stdout, and failures point at the test line, not the helper. `assertStatus` includes the URL in its failure message.
- No `console.*` left outside the logger.
- `tsconfig.json` uses `module: preserve` + `moduleResolution: bundler` (typechecks under TS 5.9 and TS 6, fixes the error shown by IDEs bundling TS 6).

## [1.5.0] — 2026-08-21

### Added

- **Unit tests of framework utilities** — `unit` Playwright project (no browser, no network) running `tests/unit/*.unit.spec.ts`: `retryUtil`, `dataManager`, `excelUtil`, `executionSummary` (18 tests). Part of `npm test` and CI; `npm run test:unit`.
- `DataManager` class exported with an injectable `baseDir` (default instance unchanged).
- `smartClick` / `smartFill` accept options (`timeout`, `force`, `verify`) through the `actions` fixture.

### Changed

- **`smartClick` / `smartFill` simplified** — no manual `waitFor`/`scrollIntoViewIfNeeded`/retry loops on top of Playwright's auto-waiting `click()`/`fill()`; `smartFill` keeps a post-fill check as an auto-retrying `toHaveValue`. Suite runs ~15 % faster and flaky locators fail fast instead of after 3×5 s.
- `utilities/Fakerutility.ts` → `utilities/fakerUtil.ts`; `FakerUtility` is now used by the API example.

## [1.4.0] — 2026-08-21

### Added

- **Authentication via `storageState`** — `tests/auth.setup.ts` logs in once per browser (`setup:<browser>` projects) and stores `.auth/<browser>.json`; browser projects depend on it and start authenticated. Per-browser on purpose: session-hijacking protection binds sessions to the User-Agent. `LoginPage`, `SecureAreaPage`, `loginPage`/`secureAreaPage` fixtures, `tests/auth/login.spec.ts`.
- **API testing** — `api` project (no browser, `baseURL = API_URL`) for `*.api.spec.ts`; `tests/api/posts.api.spec.ts` with the built-in `request` fixture; `assertion.assertStatus` / `assertJsonValue`. `npm run test:api`.
- **ESLint + Prettier** — flat config with `typescript-eslint` (type-checked) and `eslint-plugin-playwright`; scripts `lint`, `lint:fix`, `format`, `format:check`, `check`. CI runs `npm run check` before the tests.
- `AUTH_URL` / `API_URL` per environment; `ENV.authUrl`, `ENV.apiUrl`, `storageStatePath()`.
- `testData/<env>/users.json`, `testData/<env>/api.json`.
- `actions` fixture: `forceClick`, `doubleClick`, `rightClick`, `hover`, `pressKey`, `selectByValue/Label`, `setChecked`, `uploadFile`, `scrollIntoView`, `waitForVisible/Hidden`.

### Changed

- TypeScript pinned to 5.x (`typescript-eslint` does not support TS 7 yet).
- `executionSummary` types the JSON report and counts the **last** result per test (correct with retries); `timedOut`/`interrupted` count as failed.

### Removed

- `utilities/ActionUtility.ts` — duplicated `clickUtil`/`fillUtil`/`waitUtil`; its unique helpers moved to the `actions` fixture.

## [1.3.0] — 2026-08-21

### Added

- `tsconfig.json` (strict), `.gitignore`, `.env.example`, npm scripts (`test*`, `typecheck`, `report*`, `allure`).
- `config/environment.ts` — `loadEnvironment()` loads `.env` (secrets) then `config/environments/<TEST_ENV>.env`; clear error on unknown environment.
- `playwright.config.ts` — `baseURL`, timeouts, CI retries/workers, trace/screenshot/video on failure.
- Page Objects (`BasePage`, `HomePage`, `DocsPage`), `testData/<env>/`, `tests/home.spec.ts` exercising fixtures, data, hard/soft assertions and Allure metadata.
- GitHub Actions workflow (`.github/workflows/playwright.yml`) with report artifacts.
- `npm run report:email` / `report:zip` (email and zip modules were previously unreachable).
- `step` fixture (Allure steps), `allure.applyDefaults()`, execution banner in `global-setup`.
- `scripts/clean-snap-env.sh` — strips snap-injected GTK variables that crash WebKit when launched from a snap-packaged IDE.

### Changed

- All modules migrated from `require`/`module.exports` to ESM imports.
- `assertionFixture` implemented (was a stub) by delegating to `utilities/assertionUtil`.
- `dataManager` typed with generic `load<T>()`.
- `takeScreenshot` numbers per test (stable under parallel workers) and attaches to the report.
- `waitForPageReady` waits for `load` + loader overlays instead of `networkidle`.
- `softAssertionUtil` uses `expect.soft` only; `assertAll()` reads `test.info().errors`.
- `CommonUtilities.ts` split into `screenshotUtil`, `excelUtil`, `fileUtil`, `scrollUtil` (kept as a re-export barrel).
- Allure report generated via `npx allure` and non-fatal when unavailable.
- Framework version read from `package.json`.
- `READme.md` → `README.md`; docs and `AI/context/framework-context.md` synced with the code.

### Fixed

- Suite did not start: `allure-playwright`, `nodemailer`, `archiver` were not installed; `baseFixture` required a non-existent `utils/` path.
- `xlsx` upgraded to 0.20.3 (SheetJS CDN) — fixes GHSA-4r6h-8v6p-xvw6 and GHSA-5pgg-2g8v-p4x9.

### Removed

- Duplicates `assertionutils.ts`, `dashboardutils.ts`, `utilities/allureUtil.ts`; abandoned `faker@6`; `node_modules/`, screenshots and `.DS_Store` from version control.

## [1.2.0]

Enterprise Automation & Reporting Update — custom fixtures, environment-aware data, soft assertions, smart click/fill/wait, Allure history, email and zip distribution.

## [1.1.0]

Intelligent Execution Update — environment management, execution dashboard, retry/click/fill/wait/assertion utilities.

## [1.0.0]

Initial release — Page Object Model.

[1.6.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.6.0
[1.5.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.5.0
[1.4.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.4.0
[1.3.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/pull/1
