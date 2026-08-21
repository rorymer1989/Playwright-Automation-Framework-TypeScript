# Feature Specification: Catalogue sorting — SCRUM-9

**Source story**: [SCRUM-9](https://qaautomationengineerweb3.atlassian.net/browse/SCRUM-9) — "Como comprador quiero ordenar el catálogo por precio para encontrar los productos más baratos"
**Application**: Swag Labs (`SHOP_URL`) · **Spec dir**: `specs/002-catalogue-sorting` · **Status**: Implemented (backfilled; tests created in v1.11 before Spec Kit)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sort the catalogue by price (Priority: P1)

As a logged-in shopper I sort the product list by price to find the cheapest or most expensive items quickly.

**Why this priority**: The core value of the story.

**Independent Test**: Select a price option in the sort dropdown and read the product list.

**Acceptance Scenarios**:

1. **AC1** — **Given** I am logged in as standard_user, **When** I select "Price (low to high)", **Then** products are listed in ascending price order.
2. **AC2** — **Given** I am logged in, **When** I select "Price (high to low)", **Then** the first product is the most expensive one (Sauce Labs Fleece Jacket, $49.99).

---

### User Story 2 - Sort the catalogue by name (Priority: P2)

As a shopper I sort alphabetically to locate a product by name.

**Why this priority**: Secondary ordering; same control as P1.

**Independent Test**: Select "Name (Z to A)" and read the product names.

**Acceptance Scenarios**:

1. **AC3** — **Given** I am logged in, **When** I select "Name (Z to A)", **Then** products are listed in reverse alphabetical order.

---

### User Story 3 - The chosen ordering stays visible (Priority: P3)

As a shopper I can see which ordering is active.

**Independent Test**: After sorting, read the selected option of the dropdown.

**Acceptance Scenarios**:

1. **AC4** — **Given** I sorted the catalogue, **When** I look at the sort dropdown, **Then** the selected option remains highlighted.

### Edge Cases

- Ties in price keep a stable order (not asserted — the demo catalogue has no ties).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The sort control (`data-test="product-sort-container"`) MUST offer `az`, `za`, `lohi`, `hilo`.
- **FR-002**: Selecting an option MUST reorder the product cards immediately.
- **FR-003**: The selected option MUST remain selected after reordering.

## Success Criteria *(mandatory)*

- **SC-001**: 4 scenarios → 4 tests tagged `@SCRUM-9`, green on chromium, firefox and webkit.
- **SC-002**: Reuses `InventoryPage.sortBy / products / selectedSortOption`; no new page object.

## Assumptions

- Authenticated state from `tests/auth.setup.ts`; product data in `testData/<env>/shop.json`.
