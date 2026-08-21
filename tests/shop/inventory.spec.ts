import { test, expect } from "../../fixtures/baseFixture";
import type { ShopData } from "../../testData/shop.types";

test.describe("Shop — product catalogue @SCRUM-2", () => {
    test.beforeEach(async ({ allure, shop }) => {
        await allure.feature("Shop");
        await allure.issue("SCRUM-2");
        await allure.story("Catalogue");
        await shop.inventory.open(); // already authenticated via storageState
    });

    test("lists the whole catalogue with names and prices", async ({ shop, data, assertion }) => {
        const { catalogSize, products } = data.load<ShopData>("shop");

        await assertion.assertCount(shop.inventory.items, catalogSize);
        const list = await shop.inventory.products();

        expect(list).toHaveLength(catalogSize);
        expect(list).toContainEqual(products.backpack);
        expect(list.every((p) => p.name.length > 0 && p.price > 0)).toBeTruthy();
    });

    test("sorts by price, low to high", async ({ shop }) => {
        await shop.inventory.sortBy("lohi");
        const prices = (await shop.inventory.products()).map((p) => p.price);

        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test("sorts by name, Z to A", async ({ shop }) => {
        await shop.inventory.sortBy("za");
        const names = (await shop.inventory.products()).map((p) => p.name);

        expect(names).toEqual([...names].sort().reverse());
    });

    test("adding and removing products updates the cart badge", async ({ shop, data, assertion }) => {
        const { products } = data.load<ShopData>("shop");

        await assertion.assertHidden(shop.inventory.cartBadge, "Badge hidden while the cart is empty");

        await shop.inventory.addToCart(products.backpack.name, products.bikeLight.name);
        await assertion.assertText(shop.inventory.cartBadge, "2");
        await assertion.assertVisible(shop.inventory.removeButton(products.backpack.name));

        await shop.inventory.removeFromCart(products.backpack.name);
        await assertion.assertText(shop.inventory.cartBadge, "1");
        await assertion.assertVisible(shop.inventory.addToCartButton(products.backpack.name));
    });
});
