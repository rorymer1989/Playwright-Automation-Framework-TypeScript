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

## v1.5.0 — Lean Actions & Framework Unit Tests

- **`smartClick` / `smartFill` simplified**: thin wrappers over Playwright's auto-waiting API, no manual retry loops; `smartFill` keeps an auto-retrying value check.
- **Unit tests of the framework utilities** (`unit` project, 18 tests) run with `npm test` and in CI.
- `Fakerutility.ts` → `fakerUtil.ts`, now used by the API example.

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
Framework Version : v1.5.0
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

Framework Version : v1.5.0

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

# 🌐 Cross-Browser Testing

The framework supports Playwright browser projects including:

| Browser  | Supported |
| -------- | --------- |
| Chromium | ✅        |
| Chrome   | ✅        |
| Firefox  | ✅        |
| WebKit   | ✅        |

Browser configuration can be maintained through the Playwright configuration.

---

# 🔐 Authentication (storageState)

`tests/auth.setup.ts` logs in once per browser through the UI and saves the session to `.auth/<browser>.json` (git-ignored). Browser projects declare `dependencies: ["setup:<browser>"]` and `use.storageState`, so every UI test starts already authenticated and the login flow is not repeated. See `tests/auth/login.spec.ts`.

The state is per browser on purpose: apps with session-hijacking protection bind the session to the User-Agent.

---

# 🔌 API Testing

`*.api.spec.ts` files run in the `api` project (no browser) against `API_URL` using Playwright's built-in `request` fixture and the `assertion.assertStatus` / `assertJsonValue` helpers. See `tests/api/posts.api.spec.ts`.

```bash
npm run test:api
```

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
├── AI/                                # Agent prompts, rules and framework context
├── config
│   ├── environments/                  # dev.env, uat.env, pre-prod.env, prod.env (BASE_URL)
│   ├── environment.ts                 # loadEnvironment(), ENV
│   └── executionConfig.ts
├── fixtures
│   ├── baseFixture.ts                 # test/expect + homePage, docsPage, actions, assertion, data, allure, step
│   ├── actionFixture.ts
│   └── assertionFixture.ts
├── pages                              # BasePage, HomePage, DocsPage, LoginPage, SecureAreaPage
├── tests                              # *.spec.ts, auth/, api/*.api.spec.ts, unit/*.unit.spec.ts, auth.setup.ts
├── testData/<env>/*.json              # environment-aware test data
├── utilities
│   ├── assertionUtil.ts  softAssertionUtil.ts
│   ├── clickUtil.ts  fillUtil.ts  waitUtil.ts  retryUtil.ts
│   ├── screenshotUtil.ts  excelUtil.ts  fileUtil.ts  scrollUtil.ts
│   ├── fakerUtil.ts  dataManager.ts  dashboardUtil.ts
│   └── CommonUtilities.ts             # compatibility re-exports only
├── reporting
│   ├── allure/                        # allureUtil, stepUtil, environmentWriter, defaultMetadata
│   ├── email/                         # emailUtil, executionSummary, emailTemplate, emailConfig
│   └── zip/                           # zipReport
├── scripts                            # clean-snap-env.sh, send-report.ts, zip-reports.ts
├── global-setup.ts / global-teardown.ts
├── playwright.config.ts
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
EMAIL_FROM=
EMAIL_PASSWORD=   # Gmail: use an App Password
EMAIL_TO=
EMAIL_SERVICE=gmail   # optional
```

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
| `utilities/fileUtil.ts`                  | `downloadFile`, `createFolder`                                                 |
| `utilities/scrollUtil.ts`                | `clickWithScroll` for horizontal containers                                    |
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
