# Feature Specification: Cart persistence and Reset App State — SCRUM-23

**Source story**: [SCRUM-23](https://qaautomationengineerweb3.atlassian.net/browse/SCRUM-23) — "Como comprador quiero que mi carrito persista al navegar y poder vaciarlo con Reset App State"
**Application**: Swag Labs (`SHOP_URL`) · **Spec dir**: `specs/008-cart-persistence` · **Status**: Implemented

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The cart survives navigation (Priority: P1)

As a logged-in shopper, the products I added stay in my cart while I move around the shop or reload the page, so I never lose my selection before paying.

**Why this priority**: Losing the cart is the most expensive failure of the purchase funnel.

**Independent Test**: Add products, reload / navigate, read the cart counter.

**Acceptance Scenarios**:

1. **AC1** — **Given** I have products in the cart, **When** I reload the catalogue page, **Then** the cart counter keeps the same quantity.
2. **AC2** — **Given** I am on the cart page with products, **When** I click "Continue Shopping", **Then** I return to the catalogue and the counter keeps the same quantity.

---

### User Story 2 - Empty the cart with Reset App State (Priority: P2)

As a shopper I can wipe everything I selected from the side menu and start over.

**Why this priority**: Recovery path; depends on P1 to be meaningful.

**Independent Test**: Add products, open the side menu, click "Reset App State", read the counter and the cart page.

**Acceptance Scenarios**:

1. **AC3** — **Given** I have products in the cart, **When** I open the side menu and click "Reset App State", **Then** the cart counter disappears.
2. **AC4** — **Given** I have reset the state, **When** I open the cart page, **Then** it contains no product lines.

### Edge Cases

- After "Reset App State" the catalogue buttons may still read "Remove" until the page is reloaded (known Swag Labs behaviour); the story only asserts on the counter and the cart page, not on the button labels.
- Resetting with an already empty cart is a no-op (not asserted).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The cart content MUST persist across a full page reload of the catalogue.
- **FR-002**: "Continue Shopping" on the cart page MUST return to the catalogue without altering the cart.
- **FR-003**: "Reset App State" in the side menu MUST empty the cart: counter hidden and cart page without lines.

## Success Criteria *(mandatory)*

- **SC-001**: 4 scenarios → 4 tests tagged `@SCRUM-23`, green on chromium, firefox and webkit (and the mobile projects).
- **SC-002**: Reuses the existing shop page objects (`ShopBasePage`, `InventoryPage`, `CartPage`); no new page object expected.

## Assumptions

- Authenticated state from `tests/auth.setup.ts`; products from `testData/<env>/shop.json`.
- "Quantity" means the number shown on the cart badge (two distinct products → "2").
