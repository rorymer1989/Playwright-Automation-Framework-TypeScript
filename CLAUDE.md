# CLAUDE.md

Playwright Test + TypeScript (strict, CommonJS) framework: Page Object Model + custom fixtures, Spec Kit for spec-driven work, official Playwright Test Agents for exploration/generation/healing.

## Read first (in this order)

1. `.specify/memory/constitution.md` — **binding rules** (reuse before creating, tests are specs, deterministic automation, observability, quality gates). It wins over everything else.
2. `AI/config/ai-rules.md` — short operational summary of the constitution + what an agent must never touch.
3. `AI/context/framework-context.md` — directory map, fixtures, utilities and npm scripts. Keep it accurate when you add or move a component.

## Non-negotiables

- Import `test`/`expect` from `fixtures/baseFixture.ts`, never from `@playwright/test` (except `tests/unit/`).
- API calls through the `api` fixture (`api/` typed clients: `api.posts`, `api.users`); add a client per resource, never raw URLs in tests.
- Assertions through the `assertion` fixture (`assertion.soft.*` for soft); multi-step flows through `step`.
- Locator priority: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId` (`data-test`) → `getByText` → CSS → XPath. Discover locators on the live app (Playwright MCP); never guess.
- No `waitForTimeout`, `networkidle`, manual retry loops or `console.*` (use `utilities/logger.ts`).
- Environment URLs/credentials only from `config/environments/*.env` and `testData/<env>/`; never hard-code.
- Tests start authenticated via `storageState`; login tests opt out with `test.use({ storageState: { cookies: [], origins: [] } })`.
- Do not modify `playwright.config.ts`, `config/`, `.github/`, secrets or existing utilities without an explicit human instruction. Never weaken an assertion to make a test pass.

## Workflow

- New feature/story: `/jira-test SCRUM-<n>` (or `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) on branch `feat/SCRUM-<n>`; `specs/<NNN-slug>/{spec,plan,tasks}.md` must exist for every suite under `tests/shop/`.
- Broken locator: `/heal tests/<area>/<spec>.spec.ts[:line]` → delegates to `.claude/agents/playwright-test-healer.md`, review its diff.
- Before any commit: `npm run check` and `npx playwright test --project=unit`. Then chromium first, then firefox and webkit.
- Commits prefixed with the story key. Pushing, opening or merging PRs only on a human instruction.

## Useful commands

```
npm test                         # full local run (3 browsers + api + unit)
npm run test:story -- "@SCRUM-9" # one story
npm run test:chromium / :firefox / :webkit / :api / :unit / :a11y
npm run test:visual              # visual regression inside the official Docker image
npm run check                    # typecheck + eslint + prettier
npm run jira:story -- SCRUM-9    # fetch a story; npm run jira:bugs raises bugs from test-result.json
```

CI (`.github/workflows/playwright.yml`): `check` → matrix (chromium/firefox/webkit × 2 shards + api) + `visual` (Docker) → `merge-reports`. Runs on push/PR to `main`, nightly (Mon–Fri 03:00 UTC) and manually; Jira bugs and the email summary are sent only on non-PR runs.
