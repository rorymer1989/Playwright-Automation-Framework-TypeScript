# Implementation Plan: Cart persistence and Reset App State — SCRUM-23

**Spec**: `specs/008-cart-persistence/spec.md` · **Tests**: `tests/shop/cart-persistence.spec.ts` · **Constitution check**: I–V ✔

**Application / environment**: Swag Labs via `ENV.shopUrl` (`SHOP_URL` in `config/environments/<env>.env`, default `uat` → https://www.saucedemo.com). Authenticated through `storageState` from `tests/auth.setup.ts`.

| Scenario | Test |
| --- | --- |
| AC1 | `AC1: the cart badge keeps its count after reloading the catalogue` |
| AC2 | `AC2: 'Continue Shopping' returns to the catalogue with the badge intact` |
| AC3 | `AC3: 'Reset App State' from the side menu removes the cart badge` |
| AC4 | `AC4: the cart page has no lines after resetting the app state` |

## Components

Reused (no new page object, utility or fixture):

- `shop.inventory` (`InventoryPage`): `open()`, `addToCart(...names)`, `openCart()`, `cartBadge`, `resetAppState()` (inherited from `ShopBasePage`: opens the menu, clicks Reset App State, closes the menu).
- `shop.cart` (`CartPage`): `items`, `lines()`, `continueShoppingButton`, `open()`.
- Fixtures: `assertion` (`assertText`, `assertHidden`, `assertCount`, `assertURLContains`), `step`, `allure`, `data`.
- Data: `testData/<env>/shop.json` → `products.backpack`, `products.bikeLight` (2 distinct products → badge "2").

Added: none. Spec file `tests/shop/cart-persistence.spec.ts` (matches the `mobile-*` projects' `testMatch` as well).

## Locators (verified live on 2026-08-21, throwaway `npx tsx` probe)

| Element | Locator (already in page objects) | Observation |
| --- | --- | --- |
| Cart badge | `getByTestId("shopping-cart-badge")` | "2" after adding two products; **persists after `page.reload()`** (`localStorage["cart-contents"] = [4,0]`) |
| Cart link | `getByTestId("shopping-cart-link")` | → `/cart.html`, 2 lines (`getByTestId("inventory-item")`) |
| Continue Shopping | `getByTestId("continue-shopping")` | `<button>Continue Shopping</button>` → `/inventory.html`, badge still "2" |
| Open menu | `getByRole("button", { name: "Open Menu" })` | |
| Reset App State | `getByTestId("reset-sidebar-link")` | `<a>Reset App State</a>`; after click the badge is **removed without reload** and `localStorage["cart-contents"]` is `null` |
| Cart lines after reset | `getByTestId("inventory-item")` on `/cart.html` | count 0 |
| Catalogue Remove buttons after reset | `getByTestId("remove-*")` | still 2 — known Swag Labs quirk, **not asserted** (spec edge case) |

## Test design notes

- Each test builds its own precondition (add 2 products) — no shared state between tests; `fullyParallel` safe.
- AC1 uses `page.reload()`; AC2 navigates through the cart; AC3/AC4 call `resetAppState()` then assert on badge / cart page respectively. AC4 re-adds products and resets in its own test to stay independent.
- `assertHidden(cartBadge)` covers "badge disappears" (Playwright treats a detached element as hidden).

## Complexity Tracking

None.
