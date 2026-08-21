# Feature Specification: Product catalogue — SCRUM-2

**Source story**: [SCRUM-2](https://qaautomationengineerweb3.atlassian.net/browse/SCRUM-2) — "As a shopper I want to browse the catalogue and add products to my cart"
**Application**: Swag Labs (`SHOP_URL`) · **Spec dir**: `specs/004-product-catalogue` · **Status**: Implemented (backfilled; tests created in v1.9 before Spec Kit)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the catalogue (Priority: P1)

As a logged-in shopper I see every product with its name and price.

**Why this priority**: Entry point of the purchase funnel.

**Independent Test**: Open `/inventory.html` and read all product cards.

**Acceptance Scenarios**:

1. **AC1** — **Given** I am logged in, **When** I open the catalogue, **Then** `catalogSize` cards are listed, each with a non-empty name and a price > 0, **And** the reference product (`products.backpack`) is among them with the expected name, description and price.

---

### User Story 2 - Sort the catalogue (Priority: P2)

As a shopper I reorder the list by price or name.

**Why this priority**: Smoke coverage of the sort control; the exhaustive scenarios live in SCRUM-9 (`specs/002-catalogue-sorting`).

**Acceptance Scenarios**:

1. **AC2** — **Given** the catalogue, **When** I select "Price (low to high)", **Then** prices are ascending.
2. **AC3** — **Given** the catalogue, **When** I select "Name (Z to A)", **Then** names are in reverse alphabetical order.

---

### User Story 3 - Add and remove from the cart (Priority: P1)

As a shopper I add products from the list and the cart badge reflects the count.

**Independent Test**: Click Add to cart / Remove on two products and read the badge.

**Acceptance Scenarios**:

1. **AC4** — **Given** an empty cart, **Then** no badge is shown; **When** I add two products, **Then** the badge reads "2" and the first product shows a "Remove" button; **When** I remove it, **Then** the badge reads "1" and the "Add to cart" button is back.

### Edge Cases

- Badge disappearance after removing the last item is asserted in SCRUM-3 (after order completion).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each card MUST expose `inventory-item-name`, `inventory-item-desc`, `inventory-item-price`.
- **FR-002**: Add/Remove buttons MUST be addressable by product slug (`add-to-cart-<slug>` / `remove-<slug>`).
- **FR-003**: `shopping-cart-badge` MUST be absent when the cart is empty.

## Success Criteria *(mandatory)*

- **SC-001**: 4 scenarios → 4 tests tagged `@SCRUM-2`, green on chromium, firefox and webkit.
- **SC-002**: Runs authenticated via `storageState` from `tests/auth.setup.ts`.

## Assumptions

- Expected catalogue size and reference products in `testData/<env>/shop.json`.
