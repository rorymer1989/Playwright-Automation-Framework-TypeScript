# Implementation Plan: Cart and checkout — SCRUM-3

**Spec**: `specs/005-cart-checkout/spec.md` · **Tests**: `tests/shop/checkout.spec.ts` · **Constitution check**: I–V ✔

| Scenario | Test |
| --- | --- |
| AC1 | `cart shows the selected products and lets you remove one` |
| AC2 | `checkout validation: first name required` |
| AC3 | `checkout validation: last name required` |
| AC4 | `checkout validation: postal code required` |
| AC5 | `full checkout: totals are consistent and the order is confirmed` |
| AC6 | `cancelling on the overview returns to the catalogue with the cart intact` |

Components reused: `shop.inventory`, `shop.cart` (`lines()`, `removeButton`, `checkout`), `shop.checkoutInfo` (`fill`, `continue`, `error`), `shop.checkoutOverview` (`items`, `totals()`, `finish`, `cancelButton`), `shop.checkoutComplete` (`header`, `cartBadge`), `step`, `assertion`, `FakerUtility`.

Locators (verified live in v1.9): see `pages/shop/CartPage.ts` and `pages/shop/CheckoutPages.ts` — all `data-test` ids (`checkout`, `firstName`, `lastName`, `postalCode`, `continue`, `cancel`, `error`, `subtotal-label`, `tax-label`, `total-label`, `finish`, `complete-header`).

## Complexity Tracking

None.
