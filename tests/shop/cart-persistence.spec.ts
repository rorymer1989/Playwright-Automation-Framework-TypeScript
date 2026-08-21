// spec: specs/008-cart-persistence/spec.md
// seed: tests/seed.spec.ts

import { test } from "../../fixtures/baseFixture";
import type { ShopData } from "../../testData/shop.types";

test.describe("Shop — cart persistence @SCRUM-23", () => {
    test.beforeEach(async ({ allure, shop }) => {
        await allure.feature("Shop");
        await allure.issue("SCRUM-23");
        await allure.story("Cart persistence");
        await shop.inventory.open(); // already authenticated via storageState
    });

    test("AC1: the cart badge keeps its count after reloading the catalogue", async ({
        shop,
        assertion,
        data,
        page,
    }) => {
        const { backpack, bikeLight } = data.load<ShopData>("shop").products;

        // Add backpack + bikeLight to the cart and assert the badge shows "2"
        await shop.inventory.addToCart(backpack.name, bikeLight.name);
        await assertion.assertText(shop.inventory.cartBadge, "2");

        // Reload the catalogue page
        await page.reload();

        // Assert the badge still shows "2" and the catalogue title is visible
        await assertion.assertText(shop.inventory.cartBadge, "2");
        await assertion.assertText(shop.inventory.title, "Products");
    });

    test("AC2: 'Continue Shopping' returns to the catalogue with the badge intact", async ({
        shop,
        assertion,
        data,
        step,
        page,
    }) => {
        const { backpack, bikeLight } = data.load<ShopData>("shop").products;

        await step("Add backpack + bikeLight to the cart and open the cart page", async () => {
            await shop.inventory.addToCart(backpack.name, bikeLight.name);
            await shop.inventory.openCart();
        });

        await step("Assert the cart page shows the two lines", async () => {
            await assertion.assertURLContains(page, "/cart.html");
            await assertion.assertCount(shop.cart.items, 2);
        });

        await step("Click 'Continue Shopping' and assert the catalogue keeps the badge", async () => {
            await shop.cart.continueShoppingButton.click();
            await assertion.assertURLContains(page, "/inventory.html");
            await assertion.assertText(shop.inventory.cartBadge, "2");
        });
    });

    test("AC3: 'Reset App State' from the side menu removes the cart badge", async ({
        shop,
        assertion,
        data,
    }) => {
        const { backpack, bikeLight } = data.load<ShopData>("shop").products;

        // Add backpack + bikeLight to the cart and assert the badge shows "2"
        await shop.inventory.addToCart(backpack.name, bikeLight.name);
        await assertion.assertText(shop.inventory.cartBadge, "2");

        // Open the side menu and click "Reset App State"
        await shop.inventory.resetAppState();

        // Assert the cart badge is gone
        await assertion.assertHidden(shop.inventory.cartBadge, "badge is gone after Reset App State");
    });

    test("AC4: the cart page has no lines after resetting the app state", async ({
        shop,
        assertion,
        data,
        step,
        page,
    }) => {
        const { backpack, bikeLight } = data.load<ShopData>("shop").products;

        await step("Add backpack + bikeLight to the cart and reset the app state", async () => {
            await shop.inventory.addToCart(backpack.name, bikeLight.name);
            await shop.inventory.resetAppState();
        });

        await step("Open the cart page and assert it has no product lines", async () => {
            await shop.cart.open();
            await assertion.assertURLContains(page, "/cart.html");
            await assertion.assertCount(shop.cart.items, 0);
        });
    });
});
