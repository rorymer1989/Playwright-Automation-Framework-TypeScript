# Implementation Plan: Excel data-driven checkout

**Spec**: `specs/006-checkout-excel/spec.md` · **Tests**: `tests/shop/checkout-excel.spec.ts` · **Constitution check**: I–V ✔

| Scenario | Test |
| --- | --- |
| AC1 | `only rows flagged executor=Y are executed` |
| AC2 | `<caseId>: <firstName> buys <product>` (one per flagged row) |

Components reused: `utilities/excelUtil.getTestData`, `dataManager.resolve`, `shop.inventory`, `shop.cart`, `shop.checkoutInfo`, `shop.checkoutOverview`, `shop.checkoutComplete`, `assertion`. Unit coverage of the Excel reader in `tests/unit/excelUtil.unit.spec.ts`.

Locators: same `data-test` ids as `specs/005-cart-checkout`.

## Complexity Tracking

None.
