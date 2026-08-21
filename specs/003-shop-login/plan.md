# Implementation Plan: Shop login — SCRUM-1

**Spec**: `specs/003-shop-login/spec.md` · **Tests**: `tests/shop/login.spec.ts` · **Constitution check**: I–V ✔

| Scenario | Test |
| --- | --- |
| AC1 | `standard user lands on the product list` |
| AC2 | `rejects locked out user` |
| AC3 | `rejects wrong password` |
| AC4 | `rejects missing username` |
| AC5 | `rejects missing password` |
| AC6 | `logout returns to the login page and drops the session` |

Components reused: `shop.login` (`ShopLoginPage.open/login/error/loginButton`), `shop.inventory` (`title`, `items`, `logout`, `open`), `assertion` fixture, `dataManager.load<ShopData>("shop")`. AC6 opens its own `browser.newContext()` to isolate the session.

Locators (verified live in v1.9, re-validated by `/heal` in v1.14): `getByTestId("username")`, `getByTestId("password")`, `getByRole("button", { name: "Login" })`, `getByTestId("error")`, `getByRole("button", { name: "Open Menu" })`, `getByTestId("logout-sidebar-link")`.

## Complexity Tracking

None.
