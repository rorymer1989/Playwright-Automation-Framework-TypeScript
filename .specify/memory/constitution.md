# Playwright Automation Framework Constitution

Single source of truth for how features — test suites, page objects, utilities and tooling — are specified, planned and implemented in this repository. Derived from `AI/config/ai-rules.md` and `AI/context/framework-context.md`; when they disagree, this document wins.

## Core Principles

### I. Reuse Before Creating (NON-NEGOTIABLE)
Every change MUST first inspect `fixtures/baseFixture.ts`, `pages/`, `utilities/`, `testData/<env>/` and the closest existing spec. New page objects, utilities or fixtures are allowed only when no equivalent exists; duplicated helpers are a defect. `AI/context/framework-context.md` is the map and MUST be kept accurate by any change that adds or moves a component.

### II. Tests Are Specifications
A test exists only to prove an acceptance criterion. Specs under `specs/<feature>/spec.md` list scenarios as *Given / When / Then*; each scenario maps to at least one test whose title names it. Tests generated from a Jira story are tagged `@<KEY>` in the `describe` title and call `allure.issue("<KEY>")`; they MUST be runnable in isolation with `npm run test:story -- "@<KEY>"`. No test may be weakened to pass.

### III. Deterministic Automation
No `waitForTimeout`, no `networkidle`, no manual retry loops over Playwright's auto-waiting API. Locators in priority order: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId` (`data-test`), `getByText`, CSS, XPath last. Navigation is relative to the environment URLs (`BASE_URL`, `AUTH_URL`, `SHOP_URL`, `API_URL` from `config/environments/*.env`); hard-coded URLs, credentials or environment-specific values are forbidden. Tests start authenticated through `storageState` unless they test the login itself (`test.use({ storageState: { cookies: [], origins: [] } })`).

### IV. Observable by Default
Assertions go through the `assertion` fixture (hard) or `assertion.soft` (soft), which render as boxed `test.step`s. Multi-step flows use the `step` fixture. Framework output goes through `utilities/logger.ts` (`LOG_LEVEL`); `console.*` is forbidden outside it. Every failure MUST leave a trace, video and screenshot (config already does this) and be reportable to Jira by `npm run jira:bugs` without manual edits.

### V. Quality Gates Are Mandatory
`npm run check` (strict TypeScript, type-checked ESLint with Playwright rules, Prettier) and the `unit` project MUST pass before any commit. Pure utilities get unit tests in `tests/unit/`. Visual baselines are generated only inside the official Playwright Docker image (`npm run test:visual:update`). CI runs the full matrix; a change is done when CI is green. A test that passes only after a retry is **flaky** and fails the `merge-reports` gate (`FLAKY_BUDGET`, default 0): retries exist for reporting, never as a pass condition — fix the cause or quarantine with a linked issue.

## Security & Data

Secrets (`.env`: `EMAIL_*`, `JIRA_*`) never enter version control, `.env.example`, logs or Jira comments. Test data lives in `testData/<env>/` (JSON or Excel); demo credentials of public sandboxes are the only credentials allowed in the repo. Agents MUST NOT modify `playwright.config.ts`, `config/`, `.github/`, secrets or existing framework utilities without explicit human approval, and MUST NOT delete or transition Jira issues.

## Workflow

1. **Specify** — from a Jira story (`npm run jira:story -- KEY`) or a written request: `/speckit-specify` produces `specs/<KEY-or-slug>/spec.md` with prioritized scenarios.
2. **Plan** — `/speckit-plan` lists reused vs. new page objects, data files and test files, and the locators discovered by exploring the live application (Playwright MCP or a throwaway `npx tsx` script). Guessing locators is forbidden.
3. **Tasks / Implement** — `/speckit-tasks` then `/speckit-implement`, on a branch `feat/<KEY>`; run on chromium first, then firefox and webkit.
4. **Deliver** — commit prefixed with the story key; summary of scenario → test mapping; optional comment back to the Jira story. Pushing and opening PRs require a human instruction.

## Governance

This constitution supersedes ad-hoc practices. Amendments are made by pull request that updates this file, `AI/config/ai-rules.md` and, when structure changes, `AI/context/framework-context.md`, with a CHANGELOG entry. Every plan and PR review MUST verify compliance with Principles I–V; deviations require a written justification in the plan's Complexity Tracking section.

**Version**: 1.1.0 | **Ratified**: 2026-08-21 | **Last Amended**: 2026-08-21
