# AI Safety Rules

The AI must follow these rules when working with the framework.

> The binding, complete set of principles lives in `.specify/memory/constitution.md` (Spec Kit). This file is the short operational summary; if they differ, the constitution wins.

## Commands

- `/jira-test KEY` — story → spec → plan → tasks → tests (Spec Kit workflow).
- `/heal <spec>[:line]` — self-healing of broken locators, proposes a validated diff for approval.
- `/speckit-*` — generic Spec Kit skills (`specify`, `plan`, `tasks`, `implement`, `clarify`, `analyze`, `checklist`, `converge`).

## Read First

Before modifying code:

- Inspect the relevant files.
- Understand existing architecture.
- Identify reusable components.

## Do Not Modify Automatically

The AI must not automatically modify:

- Production environment files
- Credentials
- Secrets
- CI/CD configuration
- Authentication tokens
- Existing framework utilities
- Playwright configuration

unless explicitly instructed.

## Code Generation

Generated code must:

- Follow TypeScript conventions.
- Follow existing architecture.
- Reuse existing utilities.
- Reuse fixtures.
- Reuse Page Objects.
- Avoid duplication.
- Be deterministic: a test that passes only on retry is flaky and fails CI (`FLAKY_BUDGET` = 0). Never add retries, sleeps or `test.fixme()` to hide it.

## Human Approval

AI-generated modifications should be reviewed before being committed.

## Security

Never expose:

- Passwords
- API keys
- Tokens
- Environment secrets
- Authentication state
