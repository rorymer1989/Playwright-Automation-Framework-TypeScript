# 🚀 Playwright Automation Framework — TypeScript

### Enterprise-Ready | TypeScript | Playwright | Fixtures | Data-Driven | Multi-Environment | Advanced Reporting

A scalable, reusable, and enterprise-focused **Playwright Automation Framework built with TypeScript**, designed for modern UI and mobile web automation.

This framework focuses on clean architecture, reusable components, environment-aware execution, test-data management, Playwright fixtures, advanced reporting, execution visibility, and automated report distribution.

⭐ **If you find this project useful, don't forget to Star the repository!**

---

# 📖 Overview

This framework is designed using modern automation engineering practices with a strong focus on:

- Maintainability
- Scalability
- Reusability
- Test isolation
- Environment management
- Test-data management
- Execution stability
- Failure investigation
- Reporting
- CI/CD readiness

The framework provides a structured foundation for building and maintaining large Playwright automation suites.

---

# 🚀 What's New

## v1.15.0 — Typed API Layer, CLAUDE.md & Nightly CI

- `api/` typed clients + `api` fixture (usable from browser suites to seed via API), `CLAUDE.md` entry point for Claude Code, nightly CI with PR concurrency, Spec Kit backfill for every `tests/shop/` suite.

Full details in [CHANGELOG.md](CHANGELOG.md).

---

# 🌍 Environment Management

The framework supports executing the same test suite against different environments without modifying test code.

Supported environments can include:

```text
DEV
UAT
PRE-PROD
PROD
```

Environment configuration is maintained separately from test implementation.

Example structure:

```text
config
│
└── environments
    ├── dev.env
    ├── uat.env
    ├── pre-prod.env
    └── prod.env
```

Run tests using:

```bash
npm run test:dev
npm run test:uat
npm run test:prod
TEST_ENV=pre-prod npm test
```

This allows environment switching without changing the test implementation.

---

# 🗃️ Environment-Aware Test Data

A major focus of this release is separating **test data from environment configuration and test execution**.

The architecture follows:

```text
Environment
      ↓
Configuration
      ↓
Test Data
      ↓
Test Execution
```

This creates a foundation for maintaining different test-data requirements across environments.

The approach is designed to support:

- Environment-specific test data
- Centralized data management
- Reusable test data
- Dynamic test data
- Data-driven execution
- Future data seeding and cleanup strategies

---

# 🧪 Data-Driven Testing

The framework supports data-driven automation using Excel and reusable data utilities.

Example:

```text
testData
│
├── loginData.xlsx
├── userData.xlsx
└── policyData.xlsx
```

This allows multiple test scenarios to execute using different datasets without duplicating test logic.

---

# 🧠 Faker Test Data

The framework includes Faker-based dynamic test-data generation.

Useful for generating:

- Names
- Email addresses
- Mobile numbers
- Addresses
- Random test values
- Dynamic user information

This helps reduce hard-coded test data and improves test-data flexibility.

---

# 📊 Allure Reporting

Allure Reporting is integrated into the framework for detailed execution analysis.

The framework captures:

- Passed tests
- Failed tests
- Skipped tests
- Screenshots
- Videos
- Playwright traces
- Attachments
- Environment information
- Execution history
- Execution trends
- Duration trends
- Retry trends

Generate the Allure report using:

```bash
npm run allure:generate
```

Open the report:

```bash
npm run allure:open
```

Or use:

```bash
npm run allure
```

---

# 📈 Allure Environment Information

Each execution records environment information such as:

```text
Environment
Browser
Operating System
Platform
Node.js Version
Framework Version
Base URL
```

Example:

```text
Environment       : UAT
Browser           : Chromium
Platform          : darwin
Node Version      : v24.x
Framework Version : v1.15.0
Base URL          : https://example.com
```

This makes it easier to understand exactly where an execution was performed.

---

# 📉 Allure History & Trends

The framework maintains Allure history to provide visibility across executions.

Supported trend information includes:

- Execution history
- Duration trends
- Retry trends
- Category trends

This allows teams to identify changes in execution behavior over time.

---

# 🧪 Soft Assertions

Soft assertion support allows multiple validations to be performed during a test without immediately stopping execution after the first failure.

This is useful when validating multiple UI elements or business rules within the same scenario.

Example:

```typescript
await expect.soft(page.getByText("Username")).toBeVisible();

await expect.soft(page.getByText("Password")).toBeVisible();

await expect.soft(page.getByRole("button", { name: "Login" })).toBeVisible();
```

This allows the test to collect multiple validation failures before completing.

---

# ⚡ Smart Execution Utilities

Thin, intention-revealing wrappers over Playwright's auto-waiting Locator API. They add **no manual waits or retry loops**: Playwright already waits for elements to be attached, visible, stable, enabled and scrolled into view, and a click that needs retries is a flaky locator or application that should surface as such.

## Smart Click

```typescript
await actions.smartClick(page.getByRole("button", { name: "Login" }));
await actions.smartClick(locator, { timeout: 10_000, force: true }); // options are optional
```

## Smart Fill

```typescript
await actions.smartFill(page.getByLabel("Username"), "Admin");
await actions.smartFill(maskedInput, "1234", { verify: false }); // skip the value check
```

After filling, an auto-retrying `toHaveValue` assertion confirms the input kept the value — this catches masks, async formatting and re-renders that drop keystrokes.

---

## Smart Wait

```typescript
await waitForPageReady(page);
```

Provides reusable waiting logic for page readiness and application synchronization.

---

## Retry Utility

Reusable retry mechanisms are available for operations that may occasionally fail because of transient application or synchronization issues.

---

# 📸 Screenshots

Screenshots can be captured during test execution for:

- Validation points
- Failure investigation
- Debugging
- Execution evidence

Example:

```typescript
await page.screenshot({
  path: "screenshots/homepage.png",
  fullPage: true,
});
```

---

# 🎥 Videos & Traces

Playwright execution artifacts can be retained for debugging.

Supported artifacts include:

- Screenshots
- Videos
- Playwright traces
- Attachments

These artifacts can also be consumed through the Allure reporting layer.

---

# 📧 Automated Email Reporting

The framework includes automated execution email reporting.

The email report can contain:

- Execution summary
- Total tests
- Passed tests
- Failed tests
- Skipped tests
- Execution duration
- Environment information
- HTML execution report

Example execution flow:

```text
Test Execution
      ↓
Execution Summary
      ↓
HTML Report
      ↓
Report Packaging
      ↓
Email Distribution
```

This allows execution results to be distributed automatically to QA teams and stakeholders.

---

# 📦 Automated Report Packaging

Execution reports can automatically be packaged into ZIP files.

Generated reports can include:

```text
reports
│
├── playwright-report.zip
└── allure-report.zip
```

This makes it easier to share complete execution evidence with stakeholders.

---

# 📊 Execution Dashboard

The framework provides execution information at runtime.

Example:

```text
══════════════════════════════════════════════════════════════

🚀 Playwright Automation Framework

Framework Version : v1.15.0

Environment       : UAT

Base URL          : https://example.com

Browser           : Chromium

Execution Mode    : Parallel

Workers           : Default

Platform          : darwin

Operating System  : Darwin

Node Version      : v24.x

Started At        : Execution Time

══════════════════════════════════════════════════════════════
```

This provides immediate visibility into the execution context.

---

# 🌐 Cross-Browser & Mobile Testing

| Project         | Device          | Scope                            | Script                  |
| --------------- | --------------- | -------------------------------- | ----------------------- |
| `chromium`      | Desktop Chrome  | all UI suites                    | `npm run test:chromium` |
| `firefox`       | Desktop Firefox | all UI suites                    | `npm run test:firefox`  |
| `webkit`        | Desktop Safari  | all UI suites                    | `npm run test:webkit`   |
| `mobile-chrome` | Pixel 7         | `tests/shop/` (e-commerce suite) | `npm run test:mobile`   |
| `mobile-safari` | iPhone 15       | `tests/shop/` (e-commerce suite) | `npm run test:mobile`   |

Every UI project has its own `setup:<project>` that logs in with the same device profile and stores `.auth/<project>.json`. Mobile projects are scoped to the responsive e-commerce suite: visual baselines are desktop-only and the docs/auth demos are not mobile targets. CI runs both mobile projects as extra matrix entries.

Browser configuration can be maintained through the Playwright configuration.

---

# 🔐 Authentication (storageState)

`tests/auth.setup.ts` logs in once per browser through the UI and saves the session to `.auth/<browser>.json` (git-ignored). Browser projects declare `dependencies: ["setup:<browser>"]` and `use.storageState`, so every UI test starts already authenticated and the login flow is not repeated. See `tests/auth/login.spec.ts`.

The state is per browser on purpose: apps with session-hijacking protection bind the session to the User-Agent.

---

# 🔌 API Testing

`*.api.spec.ts` files run in the `api` project (no browser) against `API_URL`. Tests talk to the API through the **typed client layer** in `api/`, exposed by the `api` fixture:

```ts
const { response, body: post } = await api.posts.getById(1); // body is a Post
assertion.assertStatus(response, 200);
await api.posts.create(newPost, { expectStatus: 201 }); // fail fast on an unexpected status
```

- `api/BaseApiClient.ts` wraps `APIRequestContext` (`get/post/put/patch/delete<T>` → `{ response, body }`, debug logging, optional `expectStatus`).
- One client per resource in `api/clients/` (`PostsClient`, `UsersClient`), models in `api/types.ts`, registered in `createApiClients()`.
- The fixture opens its own request context on `API_URL`, so browser suites can use `api` and `shop` in the same test (seed through the API, verify through the UI). Unit coverage: `tests/unit/apiClient.unit.spec.ts`. See `tests/api/posts.api.spec.ts` and `specs/007-api-client`.

```bash
npm run test:api
```

---

# 🛒 Reference Suite: E-commerce Demo

`tests/shop/` automates [saucedemo.com](https://www.saucedemo.com) end to end on top of the framework and is the best place to see every piece working together:

| Spec                | Covers                                                                                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `login.spec.ts`     | Happy path, **data-driven** error cases from `testData/<env>/shop.json`, logout drops the session. Starts unauthenticated via `test.use({ storageState: … })`. |
| `inventory.spec.ts` | Catalogue size/prices, sorting (price, name), cart badge on add/remove.                                                                                        |
| `checkout.spec.ts`  | Cart lines, **data-driven** form validation, full checkout with subtotal/tax/total consistency, cancel.                                                        |
| `a11y/`, `visual/`  | Catalogue accessibility (known issue guarded) and visual baseline.                                                                                             |

Page objects live in `pages/shop/` (`getByTestId` over `data-test`), grouped in the `shop` fixture; the auth setup logs into the shop too, so tests start on the catalogue directly.

---

# ♿ Accessibility (axe-core)

The `a11y` fixture wraps [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm):

```typescript
await a11y.check(); // fails on WCAG 2.1 A/AA violations, attaches the JSON to the report
await a11y.check({ disableRules: ["color-contrast"] }); // known issue, referenced in the test
const violations = await a11y.scan({ exclude: ["iframe"] }); // audit mode, no assertion
```

See `tests/a11y/accessibility.spec.ts`. `npm run test:a11y`.

---

# 🖼️ Visual Regression

The `visual` fixture wraps `toHaveScreenshot()` with animations disabled, caret hidden and optional masks:

```typescript
await visual.match(page, "login-page", { fullPage: true });
await visual.match(dialog, "confirm-dialog", { mask: [page.locator(".timestamp")] });
```

Baselines live in `tests/visual/__snapshots__/` — one per browser **and OS** — and are rendered inside the official Playwright Docker image so that local and CI pixels match:

```bash
npm run test:visual           # compare (Docker)
npm run test:visual:update    # (re)generate baselines after an intended UI change (Docker)
npm run test:visual:local     # host run, informational: fonts differ from CI
```

CI runs the `visual` job in the same image; diffs are uploaded as artifacts on failure.

---

# 📐 Spec-Driven Development (GitHub Spec Kit)

The repo is a [Spec Kit](https://github.com/github/spec-kit) project. `.specify/memory/constitution.md` is the **binding rulebook** (for people and AI agents); `specs/<feature>/` holds `spec.md` (Given/When/Then scenarios — each becomes a test), `plan.md` (reused vs. new components, locators verified on the live app) and `tasks.md`.

| Command                                                                     | What it does                                                                                                                                                                   |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement` | Generic Spec Kit workflow (plus `clarify`, `analyze`, `checklist`, `converge`)                                                                                                 |
| `/jira-test SCRUM-12`                                                       | Jira story → the workflow above → tests tagged `@SCRUM-12`, run on 3 browsers, summary back to the story                                                                       |
| `/heal tests/shop/login.spec.ts`                                            | Self-healing of a broken locator: classify → discover on the live page → validate candidates (role → label → placeholder → test-id → text → CSS) → propose a diff for approval |

Example: `specs/001-product-detail/` (SCRUM-22) → `tests/shop/product-detail.spec.ts`.

### Official Playwright Test Agents

`npx playwright init-agents --loop=claude` installed the official **planner / generator / healer** agents (`.claude/agents/`) and the `playwright-test` MCP server (`.mcp.json`). They explore and verify against a real browser. Integration points:

- `tests/seed.spec.ts` is the template every generated test inherits (framework fixture, `shop` page objects, `@KEY` tag) — keep it compiling; it is excluded from the run.
- Each agent definition ends with a binding **Repository rules** section (reuse, locator priority, no `networkidle`/`waitForTimeout`, never weaken assertions or `test.fixme()`).
- `/jira-test` delegates exploration to the planner and per-scenario generation to the generator; `/heal` delegates to the healer and reviews its diff.

---

# 🎫 Jira: Stories → Tests

The framework can pull a user story from Jira Cloud and generate framework-compliant tests for it.

```text
JIRA_BASE_URL=https://<site>.atlassian.net
JIRA_EMAIL=                 # email of the Atlassian account that created the token
JIRA_API_TOKEN=             # https://id.atlassian.com/manage-profile/security/api-tokens
```

```bash
npm run jira:story -- SCRUM-12          # story as Markdown (summary, description, acceptance criteria, subtasks)
npm run jira:story -- SCRUM-12 --json
```

- **`/jira-test SCRUM-12`** (Claude Code command, `.claude/commands/jira-test.md`): fetches the story, reads `AI/` rules, explores the app for real locators, reuses page objects/fixtures/data, generates `tests/<area>/<story>.spec.ts`, runs it on the three browsers and commits on `feat/SCRUM-12`.
- **Traceability**: specs tag the story in the title (`@SCRUM-12`) and call `allure.issue("SCRUM-12")`, which renders a link to Jira in the Allure report. Run a story's tests with `npm run test:story -- "@SCRUM-12"`.
- **Bugs from failures**: `npm run jira:bugs` creates one Bug per failed test in `test-result.json` (structured ADF description: steps, expected, actual, environment; screenshot/video/trace attached; `automated` label). Already-open bugs with the same summary get a comment instead of a duplicate. `--dry-run` prints what would be created. `JIRA_PROJECT_KEY` (default `SCRUM`), `REPORT_URL` linked in the bug.
- `utilities/jiraClient.ts` (`getStory`, `search`, `createBug`, `attach`, `addComment`) is unit-tested against a local server.

> **Security**: the API token is a password. Keep it only in `.env` (git-ignored) or CI secrets, never in `.env.example`; rotate it if it was ever printed or committed.

---

# 🧨 Failure Paths Demo

`tests/demo/failures.spec.ts` contains **controlled failures** (hard, soft ×3, flaky-then-pass, real visual diff with saucedemo's `problem_user`, timeout) to prove the failure side of the framework: traces/videos/screenshots, retries → _flaky_, soft aggregation, `expected/actual/diff` images, Allure categories and a red email. They are skipped unless opted in:

```bash
npm run test:demo-failures                                   # chromium, 1 retry — expected to fail
DEMO_FAILURES=1 VISUAL_TESTS=tests/demo npm run test:visual  # the visual diff, rendered in Docker
```

In CI: _Run workflow_ → tick **demo_failures**. Baseline for the visual case: `DEMO_FAILURES=1 VISUAL_BASELINE_USER=standard VISUAL_TESTS=tests/demo sh scripts/visual-docker.sh --update-snapshots`.

---

# 🚦 Environment Preflight

`global-setup` GETs every configured URL (`BASE_URL`, `AUTH_URL`, `SHOP_URL`, `API_URL`) and **fails fast** listing the unreachable ones, instead of letting every test time out (e.g. `TEST_ENV=prod` with placeholder hosts fails in ~5 s). `SKIP_PREFLIGHT=1` bypasses it.

---

# 📑 Excel Data-Driven Example

`tests/shop/checkout-excel.spec.ts` runs one checkout per row flagged `executor=Y` in `testData/<env>/checkout-customers.xlsx` (edit `scripts/generate-excel-data.ts`, then `npm run data:excel`).

---

# ⚙️ CI Pipeline

```
check (typecheck · lint · format · unit)
  ├── test   matrix: chromium | firefox | webkit  × shard 1/2, 2/2   +  api
  └── visual (official Playwright image)
        └── merge-reports: blob → single HTML report · Allure report
```

- Each shard installs only its browser and uploads a **blob** report; `merge-reports` produces one `playwright-report` artifact plus the Allure report.
- `workflow_dispatch` lets you pick `TEST_ENV`.
- A unit test (`tests/unit/ciConfig.unit.spec.ts`) fails if the Docker image tag in the workflow drifts from `@playwright/test`.
- **Closing the loop** (on `push` to `main` and manual runs, never on PRs): `merge-reports` also builds a merged `test-result.json`, raises de-duplicated **Jira bugs** for failed tests (`npm run jira:bugs`) and **emails** the summary with a link to the run. Both steps are skipped unless the repository secrets exist: `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` (+ optional variable `JIRA_PROJECT_KEY`) and `EMAIL_FROM`, `EMAIL_PASSWORD`, `EMAIL_TO` (+ optional `EMAIL_SERVICE`). Set them with `gh secret set NAME`.

---

# 🪵 Logging

Framework output (banner, setup/teardown, reporting) goes through `utilities/logger.ts` and is controlled by `LOG_LEVEL` (`silent` | `error` | `warn` | `info` | `debug`, default `info`):

```bash
LOG_LEVEL=warn npm test   # only the test runner output
```

Inside tests, don't log: every `assertion.*` call is already a `test.step` visible in the HTML/Allure report and the trace viewer, and the `step` fixture wraps any other action.

---

# 🧪 Unit Tests of the Framework

Pure utilities (`retryUtil`, `dataManager`, `excelUtil`, `executionSummary`) have unit tests in `tests/unit/*.unit.spec.ts`, run by the `unit` project with no browser and no network. They are part of `npm test` and CI.

```bash
npm run test:unit
```

---

# 📱 Mobile Web Testing

The framework supports browser-based mobile automation using Playwright device emulation.

Capabilities include:

- Mobile viewport testing
- Device emulation
- Touch interaction
- Responsive testing
- Mobile browser validation
- Cross-device testing

Example:

```typescript
import { devices } from "@playwright/test";

projects: [
  {
    name: "Mobile Chrome",
    use: {
      ...devices["Galaxy S24"],
    },
  },
];
```

---

# ⚡ Parallel Execution

Playwright parallel execution is supported for faster test execution.

Benefits include:

- Multiple workers
- Faster regression execution
- Independent test execution
- Cross-browser execution
- Scalable test suites

Example:

```bash
npx playwright test --workers=4
```

---

# 🏗️ Page Object Model

The framework follows the Page Object Model architecture.

Example:

```text
pages
│
├── LoginPage.ts
├── HomePage.ts
├── DashboardPage.ts
└── CheckoutPage.ts
```

Page objects contain reusable locators and page-level actions while test files focus on business scenarios.

---

# 📂 Framework Architecture

```text
Playwright-Automation-Framework-TypeScript
│
├── .github/workflows/playwright.yml   # CI: typecheck + tests + artifacts
├── .specify/                          # Spec Kit: constitution, templates, scripts
├── specs/                             # spec.md / plan.md / tasks.md per feature
├── AI/                                # Agent context (map) and short rules; constitution wins
├── config
│   ├── environments/                  # dev.env, uat.env, pre-prod.env, prod.env (BASE_URL)
│   ├── environment.ts                 # loadEnvironment(), ENV
│   └── executionConfig.ts
├── fixtures
│   ├── baseFixture.ts                 # test/expect + homePage, docsPage, actions, assertion, data, allure, step
│   ├── actionFixture.ts
│   └── assertionFixture.ts
├── pages                              # BasePage, HomePage, DocsPage, LoginPage, SecureAreaPage, shop/
├── tests                              # *.spec.ts, auth/, shop/, api/, a11y/, visual/, demo/ (+__snapshots__), unit/, auth.setup.ts
├── testData/<env>/*.json              # environment-aware test data
├── utilities                          # + logger.ts
│   ├── assertionUtil.ts  softAssertionUtil.ts
│   ├── clickUtil.ts  fillUtil.ts  waitUtil.ts  retryUtil.ts
│   ├── screenshotUtil.ts  excelUtil.ts  a11yUtil.ts  visualUtil.ts
│   └── fakerUtil.ts  dataManager.ts  dashboardUtil.ts  jiraClient.ts  preflight.ts
├── reporting
│   ├── allure/                        # allureUtil, stepUtil, environmentWriter, defaultMetadata
│   ├── email/                         # emailUtil, executionSummary, emailTemplate, emailConfig
│   └── zip/                           # zipReport
├── scripts                            # clean-snap-env.sh, send-report.ts, zip-reports.ts
├── global-setup.ts / global-teardown.ts
├── playwright.config.ts / merge.config.ts
├── tsconfig.json
├── eslint.config.mjs / .prettierrc
├── .env.example                       # copy to .env for secrets (git-ignored)
└── package.json
```

---

# 📊 Reporting Architecture

The framework follows a layered reporting approach:

```text
                    Test Execution
                         │
                         ▼
                Playwright Artifacts
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
        Screenshots    Videos       Traces
            │            │            │
            └────────────┼────────────┘
                         ▼
                  Allure Results
                         │
                         ▼
                  Allure Report
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Stakeholder View       Email Report
```

---

# 📁 Artifact Management

Execution artifacts are organized into dedicated directories.

```text
Execution
│
├── allure-results
├── allure-report
├── playwright-report
├── test-results
├── screenshots
├── downloads
└── reports
```

This prevents different execution artifacts from becoming mixed together.

---

# 🔧 Configuration

Playwright configuration is centralized in:

```text
playwright.config.ts
```

Configuration can control:

- Base URL
- Browser projects
- Workers
- Retries
- Timeouts
- Screenshots
- Videos
- Traces
- Reporter configuration
- Environment configuration

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/mrpathak20/Playwright-Automation-Framework.git
```

Navigate into the project:

```bash
cd Playwright-Automation-Framework
```

---

# 2. Install Dependencies

```bash
npm install
```

---

# 3. Install Playwright Browsers

```bash
npx playwright install
```

---

# 4. Configure Environment

Configure the required environment files:

```text
config/environment/
```

Example:

```text
uat.env
preprod.env
prod.env
```

---

# 5. Run Tests

```bash
npm test                      # all browsers, TEST_ENV from .env (default uat)
npm run test:chromium         # single browser (also test:firefox / test:webkit)
npm run test:headed
npm run test:ui
npx playwright test tests/home.spec.ts
```

Quality gates (also enforced in CI):

```bash
npm run check          # typecheck + lint + format check
npm run lint:fix       # ESLint autofix
npm run format         # Prettier write
```

> The `npm test*` scripts go through `scripts/clean-snap-env.sh`, which strips GTK/GIO variables injected by snap-packaged IDEs (VS Code snap). Without it WebKit crashes on Ubuntu. Calling `npx playwright test` directly works fine from a regular terminal.

---

# 6. Run Against an Environment

```bash
npm run test:dev
npm run test:uat
npm run test:prod
TEST_ENV=pre-prod npm test
```

Precedence: shell / CI variables → `.env` → `config/environments/<TEST_ENV>.env`.

---

# 📊 View Playwright HTML Report

```bash
npx playwright show-report
```

---

# 📊 Generate Allure Report

```bash
npm run allure:generate
```

---

# 🌐 Open Allure Report

```bash
npm run allure:open
```

Or:

```bash
npm run allure
```

---

# 🧪 Run Tests with Allure

Example:

```bash
npm run test:uat
```

After execution:

```bash
npm run allure
```

---

# 📧 Send Execution Email

```bash
npm run report:zip      # reports/PlaywrightReport.zip + reports/AllureReport.zip
npm run report:email    # zips the reports and emails the execution summary
```

Set the credentials in `.env` (never commit them):

```text
EMAIL_FROM=you@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop   # Gmail App Password (16 lowercase letters), NOT your account password
EMAIL_TO=team@example.com         # comma-separated for several recipients
EMAIL_SERVICE=gmail               # optional, any nodemailer well-known service
```

### Gmail: App Password (required)

Google rejects account passwords over SMTP (`534-5.7.9 Application-specific password required`). Create an App Password once:

1. Enable 2-Step Verification: https://myaccount.google.com/signinoptions/two-step-verification
2. Create an App Password: https://myaccount.google.com/apppasswords → name it (e.g. "Playwright reports") → **Create**
3. Copy the 16 letters into `.env` as `EMAIL_PASSWORD` (spaces are ignored) and save the file
4. `npm run report:email`

The script builds the summary from `test-result.json` and always attaches that file. It refuses to run if any `EMAIL_*` variable is empty.

### Attachments and Gmail

Gmail **blocks archives that contain `.js` files** (`552-5.7.0 … potential security issue`), which rules out zipped HTML/Allure reports. Therefore:

| Variable                  | Default | Effect                                                                                                                       |
| ------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `EMAIL_ATTACH_REPORTS`    | `auto`  | Attach `PlaywrightReport.zip` / `AllureReport.zip` — `auto` means _unless `EMAIL_SERVICE=gmail`_. Force with `true`/`false`. |
| `REPORT_URL`              | —       | Link to the hosted report (CI artifacts, Allure server) shown in the email body.                                             |
| `EMAIL_MAX_ATTACHMENT_MB` | `18`    | Archives over this budget are skipped and listed in the email.                                                               |

`allure-results/` is emptied by `global-setup` on every run (history is preserved), so the report and its zip only contain the current execution; set `KEEP_ALLURE_RESULTS=1` to opt out.

---

# 🔐 Security

Environment files containing credentials, passwords, API keys, or other secrets should be excluded from version control.

Use:

```text
.env
.env.local
*.env
```

where appropriate in `.gitignore`.

Never commit:

- Passwords
- API tokens
- Email credentials
- Access keys
- Production secrets

---

# 🧰 Utilities

| Module                                   | Purpose                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| `utilities/assertionUtil.ts`             | Centralized hard assertions (`Assertion.*`)                                    |
| `utilities/softAssertionUtil.ts`         | `expect.soft` wrappers + `assertAll()`                                         |
| `utilities/clickUtil.ts` / `fillUtil.ts` | `smartClick` (thin `click` wrapper), `smartFill` (`fill` + value verification) |
| `utilities/waitUtil.ts`                  | `waitForPageReady` (load + loader overlays, no `networkidle`)                  |
| `utilities/retryUtil.ts`                 | Generic retry                                                                  |
| `utilities/screenshotUtil.ts`            | Per-test numbered screenshots attached to the report                           |
| `utilities/excelUtil.ts`                 | `getTestData`, `writeCell` (xlsx)                                              |
| `utilities/fakerUtil.ts`                 | Dynamic test data (`@faker-js/faker`)                                          |
| `utilities/dataManager.ts`               | Environment-aware JSON test data (`data` fixture)                              |
| `utilities/dashboardUtil.ts`             | Execution banner printed in `global-setup`                                     |

---

# 📌 Design Principles

The framework follows these principles:

### Reusability

Common functionality should be implemented once and reused across tests.

### Maintainability

Tests should remain simple even as the framework grows.

### Separation of Concerns

Test logic, page objects, utilities, configuration, test data, and reporting should remain separated.

### Scalability

The architecture should support increasing test volume and additional environments.

### Observability

Test failures should provide enough evidence for quick investigation.

### Environment Independence

Test implementation should not require code changes when switching environments.

---

# 🛣️ Roadmap

The framework is continuously evolving.

Planned areas include:

- 🤖 AI-enabled test automation
- 🧠 Intelligent failure analysis
- 🩹 AI-assisted test maintenance
- 🔌 MCP integration
- ☁️ Cloud execution
- 🔄 CI/CD improvements
- 🔔 Slack / Teams notifications
- 📊 Advanced execution analytics
- 🧪 Advanced test-data lifecycle management

The goal is to gradually evolve the framework toward **AI-enabled intelligent QA automation** while maintaining a strong and reliable automation foundation.

---

# 📦 Release History

See [CHANGELOG.md](CHANGELOG.md) for the complete list.

## 🚀 v1.15.0 — Typed API Layer, CLAUDE.md & Nightly CI

- `api/`, `api` fixture, `CLAUDE.md`, nightly + concurrency in `playwright.yml`, `specs/002…007`

---

## 🚀 v1.14.0 — Official Playwright Test Agents

- `.claude/agents/playwright-test-*`, `.mcp.json`, `tests/seed.spec.ts`

---

## 🚀 v1.13.0 — Spec-Driven with GitHub Spec Kit

- `.specify/` constitution + templates, `speckit-*` skills, `/jira-test` on Spec Kit, `/heal`, `specs/001-product-detail`

---

## 🚀 v1.12.0 — CI Closes the Loop

- `merge-reports`: merged JSON → `jira:bugs` + `report:email` (secrets-gated)

---

## 🚀 v1.11.0 — Jira: Stories → Tests, Failures → Bugs

- `utilities/jiraClient.ts`, `/jira-test`, `jira:story`, `jira:bugs`, `allure.issue()`

---

## 🚀 v1.10.0 — Failure Paths, Preflight & Excel

- `tests/demo/failures.spec.ts` (opt-in), `utilities/preflight.ts`, `tests/shop/checkout-excel.spec.ts`

---

## 🩹 v1.9.1 — Email reporting fixes

- Lazy email config, `allure-results` cleanup, Gmail-aware attachments, `REPORT_URL`

---

## 🚀 v1.9.0 — E-commerce Reference Suite

- `tests/shop/` (16 tests/browser), `pages/shop/`, `shop` fixture
- Multi-app auth setup, unauthenticated opt-out pattern

---

## 🚀 v1.8.0 — CI Matrix & Merged Reports

- Sharded matrix, blob reporter, `merge-reports` job
- `merge.config.ts`, `SKIP_ALLURE_REPORT`, image-tag guard

---

## 🚀 v1.7.0 — Accessibility & Visual Regression

- `a11y` fixture over `@axe-core/playwright`
- `visual` fixture, Docker-rendered baselines, `visual` CI job

---

## 🚀 v1.6.0 — Observability & Maintenance

- Assertions wrapped in boxed `test.step`s
- `utilities/logger.ts` with `LOG_LEVEL`
- Dependabot, workspace TypeScript settings

---

## 🚀 v1.5.0 — Lean Actions & Framework Unit Tests

- `smartClick` / `smartFill` without manual waits or retry loops
- `unit` project with tests for `retryUtil`, `dataManager`, `excelUtil`, `executionSummary`
- `fakerUtil` naming aligned and in use

---

## 🚀 v1.4.0 — Quality Gates, Authentication & API

- Authentication with per-browser `storageState` (`setup:<browser>` projects)
- `api` project and API assertions
- ESLint + Prettier, `npm run check` in CI
- `ActionUtility` removed in favour of the `actions` fixture

---

## 🚀 v1.3.0 — Bootstrap & Hardening

- Framework made runnable: missing dependencies, broken fixture path, stub assertion fixture
- Multi-environment config actually wired (`.env` + `config/environments`)
- Page Objects, test data and a real spec; GitHub Actions CI
- ESM everywhere, duplicates removed, `CommonUtilities` split, `xlsx` advisory fixed
- Email/zip reporting reachable via `npm run report:email`

---

## 🚀 v1.2.0 — Enterprise Automation & Reporting Update

### Architecture

- Custom Playwright Fixtures
- Improved modular architecture
- Environment-aware execution
- Environment-aware test data

### Test Execution

- Soft Assertions
- Smart Click
- Smart Fill
- Smart Wait
- Retry Utility
- Parallel Execution
- Cross-browser execution
- Mobile browser execution

### Reporting

- Allure Reporting
- Environment information
- Allure history
- Execution trends
- Duration trends
- Retry trends
- Screenshots
- Videos
- Playwright traces
- Attachments

### Distribution

- Automated HTML execution summary
- Email reporting
- Report ZIP packaging
- Playwright report packaging
- Allure report packaging

---

## 🚀 v1.1.0 — Intelligent Execution Update

- Environment Management
- Execution Dashboard
- Smart Retry Utility
- Smart Click Utility
- Smart Fill Utility
- Smart Wait Utility
- Assertion Utility

---

## 🚀 v1.0.0

- Page Object Model
- Excel Data-Driven Framework
- Cross-Browser Testing
- Mobile Browser Automation
- API Utility
- Database Utility
- HTML Reporting
- Organized Artifacts

---

# 🤝 Contributions

Contributions and technical feedback are welcome.

If you would like to improve the framework:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add/update tests
5. Commit your changes
6. Submit a Pull Request

---

# 💼 Services & Collaboration

Open to collaboration and freelance opportunities involving:

- Playwright Automation
- TypeScript Automation
- QA Automation
- Automation Framework Development
- Test Architecture
- UI Automation
- API Automation
- Mobile Web Automation
- CI/CD Integration
- Reporting Solutions
- AI-enabled QA Automation
- Automation Framework Modernization

If you are working on a project where Playwright automation or framework modernization can help, feel free to connect.

---

# ⭐ Support

If this project helped you:

⭐ Star the repository

🍴 Fork it

💡 Suggest improvements

🐛 Report issues

🤝 Contribute

📢 Share with the QA community

---

# 📬 Feedback

This framework is continuously being improved based on practical automation challenges and feedback from the testing community.

If you have ideas, suggestions, or technical feedback, feel free to open an issue or start a discussion.

---

# 🔗 Repository

GitHub:

https://github.com/mrpathak20/Playwright-Automation-Framework-TypeScript.git

---

## 🚀 Made with ❤️ by Priyanshu Pathak

### Happy Testing!
