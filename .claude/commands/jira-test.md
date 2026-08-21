---
description: Spec-driven test generation from a Jira story (e.g. /jira-test SCRUM-12) — specify → plan → tasks → implement
---

Generate framework-compliant Playwright tests for the Jira issue **$ARGUMENTS**, following `.specify/memory/constitution.md` (binding) and the Spec Kit workflow. Work autonomously; stop only if the story is unusable or Jira is not configured (then say exactly which of `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` is missing).

## 1. Fetch the story
`npm run -s jira:story -- $ARGUMENTS` → summary, description, acceptance criteria, subtasks. Read `AI/context/framework-context.md` for the component map.

## 2. Specify
Run the `speckit-specify` skill with the story Markdown as input, feature name `$ARGUMENTS-<slug>`. The resulting `specs/…/spec.md` MUST contain one **Acceptance Scenario** (Given/When/Then) per acceptance criterion; criteria that are ambiguous go to `speckit-clarify` — but answer the clarifications yourself from the live application when they are factual (element names, messages, prices), and ask the user only for genuine product decisions.

## 3. Plan
Run `speckit-plan`. The plan MUST list: application and environment URL used; page objects reused vs. added (`pages/`, exported from `pages/index.ts`, registered in `fixtures/baseFixture.ts` if new); test data files (`testData/dev|uat/`); target spec file `tests/<area>/<slug>.spec.ts`; **locators discovered on the live app**. For exploration delegate to the official **`playwright-test-planner`** subagent (it drives a real browser through the `playwright-test` MCP server and writes `specs/<feature>/coverage.plan.md`); fall back to a throwaway `npx tsx` script with ARIA snapshots / `data-test` dump. Never guess locators.

## 4. Tasks and implement
`speckit-tasks`, then `speckit-implement` on branch `feat/$ARGUMENTS` from `main`. For each scenario delegate to the official **`playwright-test-generator`** subagent with the seed `tests/seed.spec.ts` (it verifies every locator live while generating); then refactor the output to reuse page objects if the generator produced raw locators. Requirements for the final spec:
- `test.describe("<Feature> @$ARGUMENTS", …)`, `allure.feature()`, `allure.issue("$ARGUMENTS")` in `beforeEach`;
- one test per scenario, titled after it (e.g. `AC2: 'Price (high to low)' puts the most expensive product first`);
- assertions via the `assertion` fixture, `step()` for multi-step flows; data-driven loops for repeated cases;
- no `waitForTimeout`, no hard-coded URLs/credentials, no duplicate utilities.

## 5. Verify
`npm run check`, then `npm run test:story -- "@$ARGUMENTS" --project=chromium`; if something fails delegate to the **`playwright-test-healer`** subagent (bound by the repository rules: never weaken assertions, never `test.fixme()`), then all three browsers.

## 6. Deliver
Commit prefixed `$ARGUMENTS:`. Report: spec path, scenario → test mapping, components reused/added, locators, run command. If the user asks, post that summary to the story with `JiraClient.addComment`. Do not push or open a PR unless asked.
