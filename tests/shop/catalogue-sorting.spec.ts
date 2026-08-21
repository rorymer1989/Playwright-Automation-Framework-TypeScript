import { test, expect } from "../../fixtures/baseFixture";
import type { ShopData } from "../../testData/shop.types";

/**
 * Generated from Jira story SCRUM-9 — "Como comprador quiero ordenar el catálogo por precio…"
 * Each test maps to one acceptance criterion of the story.
 * Reuses: `shop.inventory` (InventoryPage.sortBy / products / selectedSortOption), shop.json data.
 */
test.describe("Shop — catalogue sorting @SCRUM-9", () => {
    test.beforeEach(async ({ allure, shop }) => {
        await allure.feature("Shop");
        await allure.story("Catalogue sorting");
        await allure.issue("SCRUM-9");
        await shop.inventory.open(); // authenticated as standard_user via storageState
    });

    test("AC1: 'Price (low to high)' lists products in ascending price order", async ({ shop }) => {
        await shop.inventory.sortBy("lohi");
        const prices = (await shop.inventory.products()).map((p) => p.price);

        expect(prices).toEqual([...prices].sort((a, b) => a - b));
        expect(prices.length).toBeGreaterThan(1);
    });

    test("AC2: 'Price (high to low)' puts the most expensive product first", async ({ shop, data }) => {
        const { products } = data.load<ShopData>("shop");
        await shop.inventory.sortBy("hilo");
        const list = await shop.inventory.products();

        expect(list[0]).toEqual({ name: "Sauce Labs Fleece Jacket", price: 49.99 });
        expect(list[0].price).toBeGreaterThanOrEqual(
            Math.max(...list.map((p) => p.price), products.backpack.price)
        );
    });

    test("AC3: 'Name (Z to A)' lists products in reverse alphabetical order", async ({ shop }) => {
        await shop.inventory.sortBy("za");
        const names = (await shop.inventory.products()).map((p) => p.name);

        expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    });

    test("AC4: the selected option stays highlighted after sorting", async ({ shop, assertion }) => {
        await shop.inventory.sortBy("hilo");
        expect(await shop.inventory.selectedSortOption()).toBe("Price (high to low)");
        await assertion.assertValue(shop.inventory.sortSelect, "hilo");

        await shop.inventory.sortBy("az");
        expect(await shop.inventory.selectedSortOption()).toBe("Name (A to Z)");
    });
});
