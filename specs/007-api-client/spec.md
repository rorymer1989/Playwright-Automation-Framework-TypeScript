# Feature Specification: Typed API client layer

**Source**: architecture review (2026-08-21) — no Jira story
**Application**: demo API (`API_URL`, JSONPlaceholder) · **Spec dir**: `specs/007-api-client` · **Status**: Implemented

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Typed API calls (Priority: P1)

As a test author I call endpoints through typed resource clients instead of hand-written URLs and untyped `response.json()`.

**Independent Test**: `api.posts.getById(1)` returns `{ response, body: Post }`.

**Acceptance Scenarios**:

1. **AC1** — **Given** the `api` fixture, **When** I call `api.posts.getById(existingPostId)`, **Then** the status is 200 and the body is a `Post` of `existingUserId`.
2. **AC2** — **When** I call `api.posts.listByUser(existingUserId)`, **Then** every post belongs to that user.
3. **AC3** — **When** I call `api.posts.create(newPost)`, **Then** the status is 201 and the body echoes the post with an id.
4. **AC4** — **When** I call `api.posts.getById(999999)`, **Then** the status is 404 (no exception unless `expectStatus` is set).
5. **AC5** — **Given** a post, **When** I call `api.users.getById(post.userId)`, **Then** the user exists and has an email.

---

### User Story 2 - API available to UI suites (Priority: P1)

As a test author I seed or verify state through the API from a browser project (setup via API, verify via UI).

**Acceptance Scenarios**:

1. **AC6** — **Given** a chromium test, **When** I use `api` and `shop` in the same test, **Then** `api` targets `API_URL` regardless of the project `baseURL` (verified by a throwaway probe on 2026-08-21; Swag Labs has no public API so no permanent UI+API test exists yet).

---

### User Story 3 - Base client behaviour (Priority: P2)

**Acceptance Scenarios** (unit, `tests/unit/apiClient.unit.spec.ts`):

1. **AC7** — JSON bodies are parsed; empty bodies yield `undefined`; non-JSON yields raw text.
2. **AC8** — `expectStatus` fails fast with method, URL, status and a body excerpt.
3. **AC9** — `basePath` is prefixed and method/params/data are forwarded to `request.fetch`.

## Requirements *(mandatory)*

- **FR-001**: `api/BaseApiClient.ts` MUST wrap `APIRequestContext` with `get/post/put/patch/delete<T>` returning `ApiResult<T>`.
- **FR-002**: One client per resource under `api/clients/`, exported through `api/index.ts` and `createApiClients()`.
- **FR-003**: The `api` fixture MUST create its own request context on `ENV.apiUrl` and dispose it.
- **FR-004**: Requests MUST be logged through `utilities/logger.ts` (debug level).

## Success Criteria *(mandatory)*

- **SC-001**: `tests/api/posts.api.spec.ts` uses only the clients (no raw `request`); 5 tests green in the `api` project.
- **SC-002**: `assertion.assertStatus/assertJsonValue` keep working on `result.response`.

## Assumptions

- JSONPlaceholder is read-only (POST/PATCH/DELETE are echoed, not persisted), so create/remove are smoke-level.
