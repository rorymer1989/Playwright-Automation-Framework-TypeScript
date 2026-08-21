import { test, expect } from "../../fixtures/baseFixture";
import type { ShopData } from "../../testData/shop.types";

/**
 * SCRUM-22 — Product detail page. Spec: specs/001-product-detail/spec.md
 * One test per acceptance scenario (AC1–AC4).
 */
test.describe("Shop — product detail @SCRUM-22", () => {
    test.beforeEach(async ({ allure, shop }) => {
        await allure.feature("Shop");
        await allure.story("Product detail");
        await allure.issue("SCRUM-22");
        await shop.inventory.open();
    });

    test("AC1: detail page shows the same name, description and price as the catalogue card", async ({
        shop,
        data,
        assertion,
        page,
    }) => {
        const { backpack } = data.load<ShopData>("shop").products;
        const card = await shop.inventory.cardDetails(backpack.name);

        await shop.inventory.openProduct(backpack.name);

        await assertion.assertURLContains(page, "/inventory-item.html?id=");
        expect(await shop.productDetail.product()).toEqual(card);
        expect(card).toMatchObject(backpack);
    });

    test("AC2: 'Add to cart' on the detail page updates the badge and toggles to 'Remove'", async ({
        shop,
        data,
        assertion,
    }) => {
        const { backpack } = data.load<ShopData>("shop").products;
        await shop.inventory.openProduct(backpack.name);

        await shop.productDetail.addToCart();

        await assertion.assertText(shop.productDetail.cartBadge, "1");
        await assertion.assertVisible(shop.productDetail.removeButton);
        await assertion.assertHidden(shop.productDetail.addToCartButton);
    });

    test("AC3: 'Back to products' returns to the catalogue with the product marked as added", async ({
        shop,
        data,
        assertion,
        page,
    }) => {
        const { backpack } = data.load<ShopData>("shop").products;
        await shop.inventory.openProduct(backpack.name);
        await shop.productDetail.addToCart();

        await shop.productDetail.backToProducts();

        await assertion.assertURLContains(page, "/inventory.html");
        await assertion.assertVisible(shop.inventory.removeButton(backpack.name));
        await assertion.assertText(shop.inventory.cartBadge, "1");
    });

    test("AC4: the cart contains exactly the product added from its detail page", async ({ shop, data }) => {
        const { backpack } = data.load<ShopData>("shop").products;
        await shop.inventory.openProduct(backpack.name);
        await shop.productDetail.addToCart();

        await shop.productDetail.openCart();

        expect(await shop.cart.lines()).toEqual([backpack]);
    });
});
