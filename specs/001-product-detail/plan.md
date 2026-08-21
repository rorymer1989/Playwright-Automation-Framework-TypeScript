# Implementation Plan: Product detail page — SCRUM-22

**Spec**: `specs/001-product-detail/spec.md` · **Branch**: `feat/SCRUM-22` · **Constitution check**: I (reuse) ✔ · II (scenario → test, `@SCRUM-22`) ✔ · III (role/test-id locators, env URLs, storageState) ✔ · IV (assertion fixture, steps) ✔ · V (check + 3 browsers) ✔

## Application analysis (live, standard_user)

| Element                           | Locator (verified)                                                                      | Notes                                           |
| --------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Product name link on card         | `inventoryItem.getByTestId("inventory-item-name")` (click)                              | navigates to `/inventory-item.html?id=<n>`      |
| Detail container                  | `getByTestId("inventory-item")`                                                         | single element on the detail page               |
| Detail name / description / price | `getByTestId("inventory-item-name" \| "inventory-item-desc" \| "inventory-item-price")` | same ids as on the card                         |
| Add / Remove on detail            | `getByTestId("add-to-cart")` / `getByTestId("remove")`                                  | no product slug in the id, unlike the catalogue |
| Back to products                  | `getByTestId("back-to-products")`                                                       | returns to `/inventory.html`                    |
| Cart badge                        | `ShopBasePage.cartBadge` (existing)                                                     |                                                 |

## Components

| Reused                                                                                                                            | Added                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shop` fixture, `InventoryPage` (`items`, `products()`, `removeButton()`), `CartPage.lines()`, `ShopBasePage` (badge, `openCart`) | `pages/shop/ProductDetailPage.ts` (`name`, `description`, `price`, `addToCartButton`, `removeButton`, `backButton`, `product()`, `addToCart()`, `backToProducts()`); `InventoryPage.openProduct(name)`; `shop.productDetail` in `baseFixture` |
| `testData/<env>/shop.json` → `products.backpack`                                                                                  | —                                                                                                                                                                                                                                             |

## Test design (`tests/shop/product-detail.spec.ts`, `describe("Shop — product detail @SCRUM-22")`)

| Scenario | Test                                                                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC1      | `AC1: detail page shows the same name, description and price as the catalogue card` — read card via `InventoryPage`, open, compare with `ProductDetailPage.product()` |
| AC2      | `AC2: 'Add to cart' on the detail page updates the badge and toggles to 'Remove'`                                                                                     |
| AC3      | `AC3: 'Back to products' returns to the catalogue with the product marked as added`                                                                                   |
| AC4      | `AC4: the cart contains exactly the product added from its detail page`                                                                                               |

## Complexity Tracking

None — no deviations from the constitution.
