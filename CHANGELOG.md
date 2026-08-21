# Changelog

All notable changes to this project are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [1.16.0] — 2026-08-21

### Added

- **Mobile emulation projects**: `mobile-chrome` (Pixel 7) and `mobile-safari` (iPhone 15), each with its own `setup:*` and `storageState`, scoped to `tests/shop/`. `npm run test:mobile`; two extra CI matrix entries (engine mapped through `matrix.browser`). 58/58 without touching a test.
- **Allure trend across CI runs**: `merge-reports` restores the newest `allure-history-*` Actions cache, seeds it before `allure generate` and saves the new history on non-PR runs only (PRs read the trend, never pollute it). Mirrors `global-teardown.ts` locally.
- **Tooling**: `engines.node >= 22`, `.nvmrc`, `author`, husky + lint-staged pre-commit (`eslint --fix` + Prettier on staged files; the full `npm run check` stays in CI).

### Changed

- `AI/context/framework-context.md` documents the three demo targets as deliberate: playwright.dev (`BASE_URL`), the-internet (`AUTH_URL`, UA-bound sessions → per-browser `storageState`, multi-domain login in `auth.setup.ts`) and saucedemo (`SHOP_URL`).
- README cross-browser section rewritten as a project / device / scope / script table.

### Removed

- `utilities/CommonUtilities.ts` (deprecated re-export barrel), `utilities/scrollUtil.ts`, `utilities/fileUtil.ts` — no consumers.

## [1.15.0] — 2026-08-21

### Added

- **Typed API client layer** (`api/`): `BaseApiClient` wraps `APIRequestContext` (`get/post/put/patch/delete<T>` → `{ response, body }`, `logger.debug`, optional `expectStatus` fail-fast, `basePath`), `clients/PostsClient`, `clients/UsersClient`, `types.ts`, `createApiClients()`. New **`api` fixture** on its own request context bound to `API_URL`, so browser suites can seed or verify state through the API next to the page objects. `tests/api/posts.api.spec.ts` uses only the clients (+ cross-resource scenario); `tests/unit/apiClient.unit.spec.ts` covers the base client.
- **`CLAUDE.md`** as the entry point for Claude Code sessions (constitution → AI rules → framework context, non-negotiables, `/jira-test` · `/heal` · `speckit-*` workflow, key scripts).
- **CI**: nightly run Mon–Fri 03:00 UTC (non-PR → Jira bugs + email summary) and a `concurrency` group that cancels superseded PR runs while never cancelling `main`/scheduled runs.
- **Spec Kit backfill**: every `tests/shop/` suite now has `specs/<NNN-slug>/{spec,plan,tasks}.md` — `002-catalogue-sorting` (SCRUM-9), `003-shop-login` (SCRUM-1), `004-product-catalogue` (SCRUM-2), `005-cart-checkout` (SCRUM-3), `006-checkout-excel`; plus `007-api-client`.
- `/heal` exercised end to end with the official `playwright-test-healer` on a deliberately broken `ShopLoginPage` test id (validated live, 21/21 on 3 browsers).

### Changed

- `.gitignore` ignores `.playwright-mcp/` (artefacts of the Playwright test agents).

## [1.14.0] — 2026-08-21

### Added

- **Official Playwright Test Agents** (`npx playwright init-agents --loop=claude --prompts`): planner / generator / healer in `.claude/agents/`, example prompts in `.claude/prompts/`, `playwright-test` MCP server in `.mcp.json` (87 tools, verified over stdio). Each agent carries a binding "Repository rules" section (reuse fixtures/page objects, locator priority, no `networkidle`/`waitForTimeout`, never weaken assertions or `test.fixme()`, plans under `specs/<feature>/`).
- `tests/seed.spec.ts` rewritten as the framework-compliant template the agents inherit (imports `fixtures/baseFixture`, `shop`/`assertion`/`data`, `@KEY` + `allure.issue`); excluded from the run via `testIgnore`.
- `/jira-test` delegates exploration to the planner and per-scenario generation to the generator; `/heal` delegates to the healer and reviews its diff against the constitution.

## [1.13.0] — 2026-08-21

### Added

- **GitHub Spec Kit** (`specify init --integration claude`): `.specify/` with a project **constitution** (v1.0.0, derived from `AI/config/ai-rules.md` and `AI/context/framework-context.md`: reuse first, tests are specifications, deterministic automation, observable by default, quality gates, security, workflow, governance), a QA-oriented spec template and the `speckit-*` skills. Specs live in `specs/<feature>/` (`spec.md`, `plan.md`, `tasks.md`).
- **`/jira-test` on Spec Kit**: story → `speckit-specify` → `speckit-plan` (live locators) → `speckit-tasks` → `speckit-implement` → verify on 3 browsers → deliver. First run: SCRUM-22 → `specs/001-product-detail/` + `tests/shop/product-detail.spec.ts` (AC1–AC4, 15/15), `ProductDetailPage`, summary commented on the story.
- **`/heal <spec>`**: self-healing for broken locators — classifies the failure, discovers candidates on the live page, validates them in constitution priority order, proposes a diff for approval. Demonstrated on `ShopLoginPage` (broken test id → `getByRole("button", { name: "Login" })`, 21/21).
- `InventoryPage.card/cardDetails/openProduct`, `ShopBasePage.baseUrl()`, `shop.productDetail` fixture.

### Fixed

- `assertURLContains` / `assertTitleContains` built a `RegExp` from raw text, so `?`, `.`, `+` acted as metacharacters (`"/inventory-item.html?id="` never matched). Now escaped via `escapeRegExp` (unit-tested).

## [1.12.0] — 2026-08-21

### Added

- **CI closes the loop** — `merge-reports` builds a merged `test-result.json` from the shard blobs and, on `push` to `main` and manual runs (never on PRs), raises de-duplicated **Jira bugs** with evidence for failed tests and **emails** the execution summary, both linking to the run. Steps are skipped when the repository secrets (`JIRA_BASE_URL/EMAIL/API_TOKEN`, `EMAIL_FROM/PASSWORD/TO`) are absent. Verified on a manual run with the failure demo: 12 bugs created with attachments, email delivered.

## [1.11.0] — 2026-08-21

### Added

- **Jira integration** (`utilities/jiraClient.ts`, Jira Cloud REST v3 with API token): `getStory` (ADF → text, acceptance-criteria detection, subtasks), `search`, `createBug` (structured ADF: steps/expected/actual/environment), `attach`, `addComment`, `resolveBugType` (issue type from project metadata — works on localized sites where "Bug" is "Error"; `JIRA_BUG_TYPE` to force). Unit-tested against a local HTTP server.
- **Stories → tests**: `npm run jira:story -- KEY` prints the story as Markdown; `/jira-test KEY` Claude Code command (`.claude/commands/jira-test.md`) fetches the story, applies `AI/` rules, explores the app, reuses components, generates a spec tagged `@KEY` with `allure.issue(KEY)`, runs it on the three browsers and commits on `feat/KEY`. First real run: SCRUM-9 → `tests/shop/catalogue-sorting.spec.ts` (4 ACs → 4 tests, 15/15), summary posted back to the story.
- **Failures → bugs**: `npm run jira:bugs [-- --dry-run]` raises one de-duplicated Bug per failed test in `test-result.json` with evidence attached (screenshot/video/trace/diff), `automated` label, `REPORT_URL` link; an open bug with the same summary gets a comment instead. Verified on the real board (SCRUM-8).
- **Traceability**: `allure.issue()` renders a Jira link in Allure and adds a `jira` label; shop suite tagged `@SCRUM-1/2/3/9`; `npm run test:story -- "@KEY"`.
- `InventoryPage.selectedSortOption()`.

### Fixed

- `AI/` prompt files referenced `ai/…` paths.

## [1.10.0] — 2026-08-21

### Added

- **Environment preflight** (`utilities/preflight.ts`, run by `global-setup`): GETs `BASE_URL`/`AUTH_URL`/`SHOP_URL`/`API_URL` and fails fast listing every unreachable target (placeholder `prod` now fails in ~5 s instead of timing out test by test). `SKIP_PREFLIGHT=1` bypasses. Unit-tested against a local HTTP server.
- **Excel data-driven example**: `tests/shop/checkout-excel.spec.ts` runs one checkout per `executor=Y` row of `testData/<env>/checkout-customers.xlsx` (`npm run data:excel` regenerates from `scripts/generate-excel-data.ts`). First real consumer of `excelUtil`.
- **Failure-paths demo** (`tests/demo/failures.spec.ts`, opt-in with `DEMO_FAILURES=1`, `npm run test:demo-failures`, CI input `demo_failures`): hard failure, three aggregated soft failures, flaky-then-pass, real visual diff (saucedemo `problem_user` vs `standard_user` baseline, 12 % pixels), timeout. Verified locally and in CI: trace/video/screenshot per failure, flaky classified as flaky by retries, soft message lists all failures, `expected/actual/diff` images, `merge-reports` consolidates failing shards, red email summary.
- `scripts/visual-docker.sh`: `VISUAL_TESTS` to target another folder; forwards `DEMO_FAILURES`, `VISUAL_BASELINE_USER`, `SKIP_PREFLIGHT`; skips Allure generation in-container.

## [1.9.1] — 2026-08-21

### Fixed

- `npm run report:email` never saw the `.env` credentials: `emailConfig` read `process.env` at import time, before `loadEnvironment()`. Now read lazily via `getEmailConfig()`.
- `allure-results/` was never cleaned, so the Allure report (and its zip) accumulated every execution; `global-setup` now empties it (history preserved, `KEEP_ALLURE_RESULTS=1` to opt out).
- Gmail blocks zipped HTML reports (archives containing `.js`): attachments are now provider-aware (`EMAIL_ATTACH_REPORTS`, default off for gmail), capped by `EMAIL_MAX_ATTACHMENT_MB`, `test-result.json` always attached, optional `REPORT_URL` link; the template lists the real attachments instead of a static list.

### Added

- README: Gmail App Password setup and attachment behaviour; unit tests for the email template/config.

## [1.9.0] — 2026-08-21

### Added

- **E-commerce reference suite** (`tests/shop/`, saucedemo.com via `SHOP_URL`): login happy path + 4 data-driven error cases + logout; catalogue size/prices, sorting, cart badge; cart lines, 3 data-driven checkout validation cases, full checkout with subtotal/tax/total consistency, cancel. 16 tests per browser, plus catalogue accessibility (real `select-name` issue excluded explicitly and guarded) and a visual baseline.
- `pages/shop/` page objects over `getByTestId` (`testIdAttribute: "data-test"`), grouped in the `shop` fixture; `testData/<env>/shop.json` with shared `ShopData` type.
- `tests/auth.setup.ts` now logs into every app under test in one context; tests that need the login form opt out with `test.use({ storageState: { cookies: [], origins: [] } })`.

## [1.8.0] — 2026-08-21

### Added

- **CI matrix with sharding** — `check` (typecheck/lint/format/unit) → `test` matrix (chromium/firefox/webkit × 2 shards + api, each installing only its browser) and `visual` (Playwright image) → `merge-reports`. Critical path ≈ 2 min with `fail-fast: false` and per-job artifacts.
- **Single merged report** — shards use the `blob` reporter; `merge-reports` runs `playwright merge-reports -c merge.config.ts` (pinned `testDir`, required because the visual job's container path differs from the runners') into one `playwright-report` artifact, and merges Allure results into one `allure-report`.
- `tests/unit/ciConfig.unit.spec.ts` — fails if the workflow's `mcr.microsoft.com/playwright` tag drifts from the installed `@playwright/test`; checks `scripts/visual-docker.sh` derives its tag from the package.

### Changed

- `playwright.config.ts` uses the `blob` reporter in CI (html locally); `global-teardown` skips Allure generation when `SKIP_ALLURE_REPORT=1`.

## [1.7.0] — 2026-08-21

### Added

- **Accessibility testing** — `a11y` fixture over `@axe-core/playwright`: `a11y.check(options)` fails on WCAG 2.1 A/AA violations and attaches the JSON to the report; `a11y.scan()` returns them for audits. Known issues are excluded explicitly with `disableRules` (+ reference) and guarded by a test that asserts they are the only ones. `tests/a11y/`, `npm run test:a11y`.
- **Visual regression** — `visual` fixture over `toHaveScreenshot()` (animations disabled, caret hidden, masks, 1 % tolerance). Baselines per browser **and OS** in `tests/visual/__snapshots__/`, generated and compared **inside the official Playwright Docker image** (`scripts/visual-docker.sh`) so local and CI pixels match; dedicated `visual` CI job in the same image. `npm run test:visual`, `test:visual:update`, `test:visual:local` (informational).
- `utilities/a11yUtil.ts`, `utilities/visualUtil.ts`, `snapshotPathTemplate` and `expect.toHaveScreenshot` defaults in `playwright.config.ts`.

### Changed

- CI `test` job excludes the visual tests (`--grep-invert "Visual regression"`); they run in the `visual` job.

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

[1.14.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.14.0
[1.13.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.13.0
[1.12.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.12.0
[1.11.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.11.0
[1.10.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.10.0
[1.9.1]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.9.1
[1.9.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.9.0
[1.8.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.8.0
[1.7.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.7.0
[1.6.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.6.0
[1.5.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.5.0
[1.4.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/releases/tag/v1.4.0
[1.3.0]: https://github.com/rorymer1989/Playwright-Automation-Framework-TypeScript/pull/1
