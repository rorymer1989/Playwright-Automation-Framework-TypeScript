# Implementation Plan: Catalogue sorting — SCRUM-9

**Spec**: `specs/002-catalogue-sorting/spec.md` · **Tests**: `tests/shop/catalogue-sorting.spec.ts` · **Constitution check**: I–V ✔

| Scenario | Test |
| --- | --- |
| AC1 | `AC1: 'Price (low to high)' lists products in ascending price order` |
| AC2 | `AC2: 'Price (high to low)' puts the most expensive product first` |
| AC3 | `AC3: 'Name (Z to A)' lists products in reverse alphabetical order` |
| AC4 | `AC4: the selected option stays highlighted after sorting` |

Components reused: `shop.inventory` (`sortBy`, `products`, `selectedSortOption`, `sortSelect`), `data.load<ShopData>("shop")`. Locators: `getByTestId("product-sort-container")`, `inventory-item-name`, `inventory-item-price` (verified live in v1.11).

## Complexity Tracking

None.
