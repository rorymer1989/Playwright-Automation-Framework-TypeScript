# Feature Specification: Shop login — SCRUM-1

**Source story**: [SCRUM-1](https://qaautomationengineerweb3.atlassian.net/browse/SCRUM-1) — "As a shopper I want to log in to Swag Labs so that I can browse the catalogue"
**Application**: Swag Labs (`SHOP_URL`) · **Spec dir**: `specs/003-shop-login` · **Status**: Implemented (backfilled; tests created in v1.9 before Spec Kit)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Successful login (Priority: P1)

As a registered shopper I log in with valid credentials and land on the product list.

**Why this priority**: Every other shop flow depends on it (it is also the `auth.setup.ts` project).

**Independent Test**: Fill username/password, submit, read the URL and the page title.

**Acceptance Scenarios**:

1. **AC1** — **Given** I am on the login page, **When** I log in as `standard_user` with the shared password, **Then** I land on `/inventory.html`, the title reads "Products" and the whole catalogue (`catalogSize` items) is listed.

---

### User Story 2 - Login errors are reported (Priority: P1)

As a shopper I see a clear error when my credentials are rejected and I stay on the login page.

**Why this priority**: Negative paths of the core flow; data-driven from `shop.json#loginErrors`.

**Independent Test**: Submit each invalid combination and read the error banner.

**Acceptance Scenarios**:

1. **AC2** — **Given** the login page, **When** I log in as `locked_out_user`, **Then** the error reads "Sorry, this user has been locked out." and I stay on the login URL.
2. **AC3** — **Given** the login page, **When** I submit a wrong password, **Then** the error reads "Username and password do not match any user in this service".
3. **AC4** — **Given** the login page, **When** I submit without username, **Then** the error reads "Username is required".
4. **AC5** — **Given** the login page, **When** I submit without password, **Then** the error reads "Password is required".

---

### User Story 3 - Logout drops the session (Priority: P2)

As a shopper I log out from the side menu and can no longer reach protected pages.

**Independent Test**: Log in, open the menu, click Logout, then request `/inventory.html` directly.

**Acceptance Scenarios**:

1. **AC6** — **Given** I am logged in, **When** I click "Logout" in the side menu, **Then** the Login button is visible again, **And** opening `/inventory.html` directly shows "You can only access '/inventory.html' when you are logged in".

### Edge Cases

- `problem_user` / `performance_glitch_user` behaviours are out of scope (covered by `tests/demo/failures.spec.ts`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The login form MUST expose `data-test="username"`, `data-test="password"` and a "Login" button.
- **FR-002**: A failed login MUST render `data-test="error"` and keep the user on the login URL.
- **FR-003**: Logout MUST invalidate the session so protected URLs redirect to login with an error.

## Success Criteria *(mandatory)*

- **SC-001**: 6 scenarios → 6 tests tagged `@SCRUM-1`, green on chromium, firefox and webkit.
- **SC-002**: Login tests run **unauthenticated** (`storageState: { cookies: [], origins: [] }`) so they exercise the form itself.

## Assumptions

- Credentials and error messages live in `testData/<env>/shop.json` (`users`, `password`, `loginErrors`).
