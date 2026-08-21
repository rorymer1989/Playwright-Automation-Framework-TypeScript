# Feature Specification: Product detail page — SCRUM-22

**Source story**: [SCRUM-22](https://qaautomationengineerweb3.atlassian.net/browse/SCRUM-22) — "Como comprador quiero ver el detalle de un producto y añadirlo al carrito desde allí"
**Application**: Swag Labs (`SHOP_URL`) · **Spec dir**: `specs/001-product-detail` · **Status**: Implemented (15/15 on chromium, firefox, webkit)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Open a product's detail from the catalogue (Priority: P1)

As a logged-in shopper I open a product from the catalogue to read its full description before deciding.

**Why this priority**: Without it no other scenario of the story is reachable.

**Independent Test**: Click a product name on the catalogue and compare the detail page against the card.

**Acceptance Scenarios**:

1. **AC1** — **Given** I am on the catalogue, **When** I click a product name, **Then** the product detail page shows the same name, description and price as the catalogue card.

---

### User Story 2 - Add to cart from the detail page (Priority: P1)

As a shopper on a product's page I add it to the cart without going back to the list.

**Why this priority**: Core value of the story.

**Independent Test**: Open any product's detail page and click "Add to cart".

**Acceptance Scenarios**:

1. **AC2** — **Given** I am on a product detail page, **When** I click "Add to cart", **Then** the cart badge shows 1 and the button changes to "Remove".
2. **AC4** — **Given** I opened a product's detail page and added it, **When** I go to the cart, **Then** the cart contains exactly that product with the same price.

---

### User Story 3 - Return to the catalogue keeping the selection (Priority: P2)

As a shopper I go back to the list and see that my selection is kept.

**Why this priority**: Consistency between views; lower risk than adding.

**Independent Test**: Add from detail, click "Back to products", inspect the product card.

**Acceptance Scenarios**:

1. **AC3** — **Given** I added the product from its detail page, **When** I click "Back to products", **Then** I am back on the catalogue and that product card shows "Remove".

### Edge Cases

- Detail page opened directly by URL (`/inventory-item.html?id=<n>`) while authenticated renders the product (covered implicitly by AC4 setup; not a separate test).
- Invalid `id` shows an error product ("ITEM NOT FOUND") — out of scope for this story.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Product name links on the catalogue MUST navigate to `/inventory-item.html?id=<n>`.
- **FR-002**: The detail page MUST display name, description and price identical to the catalogue card.
- **FR-003**: The detail page MUST offer add-to-cart / remove toggling that updates the header cart badge.
- **FR-004**: "Back to products" MUST return to the catalogue preserving cart state.

### Key Entities

- **Product**: name, description, price, id.
- **Cart**: set of products, reflected by the header badge count.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 4 acceptance scenarios → 4 automated tests tagged `@SCRUM-22`, green on chromium, firefox and webkit.
- **SC-002**: All locators are role/test-id based and discovered on the live application.
- **SC-003**: Reuses `InventoryPage`, `CartPage` and the `shop` fixture; adds only a `ProductDetailPage`.

## Assumptions

- Authenticated state from `tests/auth.setup.ts` (standard_user) is available.
- Product data comes from `testData/<env>/shop.json` (`products.backpack`).
