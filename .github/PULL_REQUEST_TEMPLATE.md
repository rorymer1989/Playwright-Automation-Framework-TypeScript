## Summary

<!-- What and why. Link the Jira story (SCRUM-n) or the spec directory. -->

## Constitution check (`.specify/memory/constitution.md`)

- [ ] **I. Reuse before creating** — inspected `fixtures/`, `pages/`, `api/`, `utilities/`, `testData/`; no duplicated helper. `AI/context/framework-context.md` updated if a component was added/moved.
- [ ] **II. Tests are specifications** — every new/changed test maps to a scenario in `specs/<feature>/spec.md`; story tests tagged `@KEY` + `allure.issue`. No assertion weakened.
- [ ] **III. Deterministic** — no `waitForTimeout` / `networkidle` / manual retry loops; locators in priority order, discovered on the live app; no hard-coded URLs or credentials.
- [ ] **IV. Observable** — `assertion` / `step` fixtures, `logger` instead of `console`.
- [ ] **V. Quality gates** — `npm run check` and `unit` pass locally; CI green.

## Test plan

- [ ] chromium · firefox · webkit
- [ ] `npm run test:mobile` (if `tests/shop/` changed)
- [ ] `npm run test:visual` (if UI/baselines changed)

## Notes for reviewers

<!-- Risks, follow-ups, anything left out on purpose. -->
