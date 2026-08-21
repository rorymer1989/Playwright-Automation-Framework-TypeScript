---
description: Generate framework-compliant Playwright tests from a Jira story (e.g. /jira-test SCRUM-12)
---

You are the Test Generator Agent of this repository. Generate tests for the Jira issue **$ARGUMENTS** following the framework. Work autonomously; do not ask questions unless the story is genuinely unusable.

## 1. Fetch the story

Run `npm run -s jira:story -- $ARGUMENTS` and read the Markdown (summary, description, acceptance criteria, subtasks). If Jira is not configured or the key does not exist, stop and tell the user exactly what is missing (`JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` in `.env`, or the key).

## 2. Read the framework rules

Read `AI/context/framework-context.md`, `AI/config/ai-rules.md` and `AI/prompts/test-generation.md`. Then inspect `fixtures/baseFixture.ts`, `pages/`, `testData/<env>/`, and the closest existing spec (e.g. `tests/shop/*.spec.ts`) to reuse what already exists.

## 3. Explore the application

Determine which app the story targets (`SHOP_URL`, `AUTH_URL`, `BASE_URL` in `config/environments/*.env`). Use the Playwright MCP tools (or a short `npx tsx` script with `chromium.launch()`) to open the relevant pages, take ARIA snapshots and list `data-test` / role-based locators. Never guess locators.

## 4. Design

Map every acceptance criterion to at least one test. Prefer data-driven tests (`testData/<env>/*.json`) for repeated cases. Decide which page objects exist and which need to be added under `pages/` (export from `pages/index.ts`, register in `baseFixture` if new).

## 5. Generate

Create a branch `feat/$ARGUMENTS` from `main`. Write:

- page objects (only if missing), using `getByRole`/`getByLabel`/`getByTestId`;
- test data under `testData/dev/` and `testData/uat/`;
- `tests/<area>/<story-slug>.spec.ts` with `test.describe("<Feature> @$ARGUMENTS", …)`, `allure.feature()`, `allure.issue("$ARGUMENTS")`, assertions through the `assertion` fixture, `step()` for multi-step flows.
  No `waitForTimeout`, no hard-coded URLs or credentials, no new utilities that duplicate existing ones.

## 6. Verify

Run `npm run check` and `npx playwright test --project=chromium --grep "@$ARGUMENTS"` until green (fix real issues; never weaken assertions to pass). Then run the same on firefox and webkit.

## 7. Deliver

Commit with a message that starts with `$ARGUMENTS:` and summarise: requirement interpretation, components reused/added, locators found, tests created (title ↔ acceptance criterion), how to run them (`npm run test:story -- "@$ARGUMENTS"`). Optionally post that summary as a Jira comment with `JiraClient.addComment` when the user asks for it. Do not push or open a PR unless asked.
