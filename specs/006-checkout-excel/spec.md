# Feature Specification: Excel data-driven checkout

**Source**: framework feature (no Jira story) — introduced in v1.10 "Failure Paths, Preflight & Excel"
**Application**: Swag Labs (`SHOP_URL`) · **Spec dir**: `specs/006-checkout-excel` · **Status**: Implemented (backfilled)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Only flagged rows run (Priority: P1)

As a test engineer I control which customers are executed from the workbook without touching code.

**Independent Test**: Load `testData/<env>/checkout-customers.xlsx` sheet "Customers" and read the selected `caseId`s.

**Acceptance Scenarios**:

1. **AC1** — **Given** the workbook has rows CHK-01…CHK-04 with an `executor` column, **When** the suite loads it, **Then** only rows flagged `Y` (CHK-01, CHK-02, CHK-04) become tests.

---

### User Story 2 - One purchase per customer row (Priority: P1)

As a shopper described by a workbook row I buy the product assigned to me.

**Acceptance Scenarios**:

1. **AC2** — **Given** a flagged row (`firstName`, `lastName`, `postalCode`, `product`), **When** I add that product, check out with the row's details and finish, **Then** the overview lists exactly 1 item containing the product name and the completion page reads "Thank you for your order!".

### Edge Cases

- Rows flagged `N` are skipped silently; `originalIndex` is kept for traceability.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `utilities/excelUtil.getTestData(workbook, sheet)` MUST return only `executor=Y` rows.
- **FR-002**: The workbook path MUST resolve per environment via `dataManager.resolve("checkout-customers")`.
- **FR-003**: The workbook MUST be regenerable with `npm run data:excel`.

## Success Criteria *(mandatory)*

- **SC-001**: 1 + N(flagged) tests (currently 4), green on chromium, firefox and webkit.
- **SC-002**: Reuses the SCRUM-3 page objects; no new page object.

## Assumptions

- Excel workbooks are checked in per environment (`testData/dev`, `testData/uat`).
