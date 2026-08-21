import { test, expect } from "../../fixtures/baseFixture";
import type { ShopData } from "../../testData/shop.types";
import dataManager from "../../utilities/dataManager";
import { FakerUtility } from "../../utilities/fakerUtil";

const shopData = dataManager.load<ShopData>("shop");

test.describe("Shop — cart and checkout @SCRUM-3", () => {
    test.beforeEach(async ({ allure, shop }) => {
        await allure.feature("Shop");
        await allure.issue("SCRUM-3");
        await allure.story("Checkout");
        await shop.inventory.open();
    });

    test("cart shows the selected products and lets you remove one", async ({ shop, assertion, page }) => {
        const { backpack, onesie } = shopData.products;

        await shop.inventory.addToCart(backpack.name, onesie.name);
        await shop.inventory.openCart();

        await assertion.assertURLContains(page, "/cart.html");
        expect(await shop.cart.lines()).toEqual([backpack, onesie]);

        await shop.cart.removeButton(onesie.name).click();
        expect(await shop.cart.lines()).toEqual([backpack]);
        await assertion.assertText(shop.cart.cartBadge, "1");
    });

    for (const { case: name, info, message } of shopData.checkoutValidation) {
        test(`checkout validation: ${name}`, async ({ shop, assertion, page }) => {
            await shop.inventory.addToCart(shopData.products.onesie.name);
            await shop.inventory.openCart();
            await shop.cart.checkout();

            await shop.checkoutInfo.fill(info);
            await shop.checkoutInfo.continue();

            await assertion.assertContainsText(shop.checkoutInfo.error, message);
            await assertion.assertURLContains(page, "/checkout-step-one.html");
        });
    }

    test("full checkout: totals are consistent and the order is confirmed", async ({
        shop,
        assertion,
        step,
        page,
    }) => {
        const { backpack, bikeLight } = shopData.products;
        const customer = {
            firstName: FakerUtility.getFirstName(),
            lastName: FakerUtility.getLastName(),
            postalCode: FakerUtility.getPinCode(),
        };

        await step("Add products and go to checkout", async () => {
            await shop.inventory.addToCart(backpack.name, bikeLight.name);
            await shop.inventory.openCart();
            await shop.cart.checkout();
        });

        await step("Enter customer information", async () => {
            await shop.checkoutInfo.fill(customer);
            await shop.checkoutInfo.continue();
        });

        await step("Verify the overview", async () => {
            await assertion.assertURLContains(page, "/checkout-step-two.html");
            await assertion.assertCount(shop.checkoutOverview.items, 2);

            const { subtotal, tax, total } = await shop.checkoutOverview.totals();
            const expectedSubtotal = +(backpack.price + bikeLight.price).toFixed(2);
            expect(subtotal).toBe(expectedSubtotal);
            expect(tax).toBeCloseTo(expectedSubtotal * shopData.taxRate, 2);
            expect(total).toBeCloseTo(subtotal + tax, 2);
        });

        await step("Finish", async () => {
            await shop.checkoutOverview.finish();
            await assertion.assertURLContains(page, "/checkout-complete.html");
            await assertion.assertText(shop.checkoutComplete.header, "Thank you for your order!");
            await assertion.assertHidden(shop.checkoutComplete.cartBadge, "Cart is empty after the order");
        });
    });

    test("cancelling on the overview returns to the catalogue with the cart intact", async ({
        shop,
        assertion,
        page,
    }) => {
        await shop.inventory.addToCart(shopData.products.onesie.name);
        await shop.inventory.openCart();
        await shop.cart.checkout();
        await shop.checkoutInfo.fill({ firstName: "Jane", lastName: "Doe", postalCode: "28001" });
        await shop.checkoutInfo.continue();

        await shop.checkoutOverview.cancelButton.click();

        await assertion.assertURLContains(page, "/inventory.html");
        await assertion.assertText(shop.inventory.cartBadge, "1");
    });
});
