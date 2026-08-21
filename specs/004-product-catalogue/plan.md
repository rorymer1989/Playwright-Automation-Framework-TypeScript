# Implementation Plan: Product catalogue — SCRUM-2

**Spec**: `specs/004-product-catalogue/spec.md` · **Tests**: `tests/shop/inventory.spec.ts` · **Constitution check**: I–V ✔

| Scenario | Test |
| --- | --- |
| AC1 | `lists the whole catalogue with names and prices` |
| AC2 | `sorts by price, low to high` |
| AC3 | `sorts by name, Z to A` |
| AC4 | `adding and removing products updates the cart badge` |

Components reused: `shop.inventory` (`open`, `items`, `products()`, `sortBy`, `addToCart`, `removeFromCart`, `addToCartButton`, `removeButton`, `cartBadge`), `assertion`, `data` fixtures.

Locators (verified live in v1.9): `getByTestId("inventory-item")`, `inventory-item-name/desc/price`, `product-sort-container`, `add-to-cart-<slug>`, `remove-<slug>`, `shopping-cart-badge`.

## Complexity Tracking

None.
