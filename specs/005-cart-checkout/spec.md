# Feature Specification: Cart and checkout — SCRUM-3

**Source story**: [SCRUM-3](https://qaautomationengineerweb3.atlassian.net/browse/SCRUM-3) — "As a shopper I want to review my cart and complete the checkout so that my order is confirmed"
**Application**: Swag Labs (`SHOP_URL`) · **Spec dir**: `specs/005-cart-checkout` · **Status**: Implemented (backfilled; tests created in v1.9 before Spec Kit)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review the cart (Priority: P1)

As a shopper I see the products I added and can remove one before paying.

**Independent Test**: Add two products, open the cart, remove one.

**Acceptance Scenarios**:

1. **AC1** — **Given** two products in the cart, **When** I open `/cart.html`, **Then** both lines show the expected name and price; **When** I remove one, **Then** only the other remains and the badge reads "1".

---

### User Story 2 - Customer information is validated (Priority: P1)

As a shopper I cannot continue the checkout without my details; data-driven from `shop.json#checkoutValidation`.

**Acceptance Scenarios**:

1. **AC2** — **Given** step one of the checkout, **When** I continue without first name, **Then** the error reads "First Name is required" and I stay on `/checkout-step-one.html`.
2. **AC3** — … without last name → "Last Name is required".
3. **AC4** — … without postal code → "Postal Code is required".

---

### User Story 3 - Complete an order (Priority: P1)

As a shopper I finish the checkout and the totals are consistent.

**Acceptance Scenarios**:

1. **AC5** — **Given** two products and valid customer data (Faker), **When** I reach the overview, **Then** it lists 2 items, subtotal = sum of prices, tax = subtotal × `taxRate`, total = subtotal + tax; **When** I click Finish, **Then** I land on `/checkout-complete.html` with "Thank you for your order!" and the cart badge is gone.

---

### User Story 4 - Cancel from the overview (Priority: P2)

**Acceptance Scenarios**:

1. **AC6** — **Given** the overview, **When** I click Cancel, **Then** I return to `/inventory.html` and the cart still holds 1 item.

### Edge Cases

- Rounding: tax/total asserted with `toBeCloseTo(…, 2)`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cart lines MUST expose `inventory-item-name/price` and `remove-<slug>`.
- **FR-002**: Step one MUST expose `firstName`, `lastName`, `postalCode`, `continue`, `cancel`, `error`.
- **FR-003**: Overview MUST expose `subtotal-label`, `tax-label`, `total-label`, `finish`, `cancel`.
- **FR-004**: Completion page MUST expose `complete-header`.

## Success Criteria *(mandatory)*

- **SC-001**: 6 scenarios → 6 tests tagged `@SCRUM-3`, green on chromium, firefox and webkit.
- **SC-002**: Customer data generated with `FakerUtility`; no hard-coded PII except the cancel scenario's dummy values.

## Assumptions

- `taxRate`, products and validation cases in `testData/<env>/shop.json`.
