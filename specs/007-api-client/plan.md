# Implementation Plan: Typed API client layer

**Spec**: `specs/007-api-client/spec.md` · **Constitution check**: I–V ✔ (new component justified: no API abstraction existed)

| Scenario | Test |
| --- | --- |
| AC1 | `GET /posts/:id returns the post` |
| AC2 | `GET /posts?userId= filters by user` |
| AC3 | `POST /posts creates a post` |
| AC4 | `GET /posts/:id for a missing post returns 404` |
| AC5 | `the author of a post exists as a user` |
| AC6 | manual probe (see spec) |
| AC7–AC9 | `tests/unit/apiClient.unit.spec.ts` |

New: `api/BaseApiClient.ts`, `api/types.ts`, `api/clients/{Posts,Users}Client.ts`, `api/index.ts`, fixture `api` in `fixtures/baseFixture.ts`.
Reused: `assertion` (API helpers), `data`, `FakerUtility`, `logger`, `ENV.apiUrl`.

Adding a resource: create `api/clients/<Name>Client.ts` extending `BaseApiClient`, add its model to `api/types.ts`, register it in `createApiClients()`.

## Complexity Tracking

`api` opens a second `APIRequestContext` per test (cheap, no browser); needed so browser projects keep their own `baseURL`.
