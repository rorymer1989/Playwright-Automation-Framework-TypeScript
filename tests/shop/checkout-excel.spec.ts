import path from "node:path";
import { test, expect } from "../../fixtures/baseFixture";
import { getTestData } from "../../utilities/excelUtil";
import dataManager from "../../utilities/dataManager";

interface CustomerRow {
    caseId: string;
    firstName: string;
    lastName: string;
    postalCode: string;
    product: string;
}

/**
 * Excel-driven checkout: one test per row flagged executor=Y in
 * testData/<env>/checkout-customers.xlsx (regenerate with `npm run data:excel`).
 */
const workbook = path.join(
    path.dirname(dataManager.resolve("checkout-customers")),
    "checkout-customers.xlsx"
);
const customers = getTestData(workbook, "Customers") as unknown as (CustomerRow & {
    originalIndex: number;
})[];

test.describe("Shop — checkout (Excel data-driven)", () => {
    test.beforeEach(async ({ allure, shop }) => {
        await allure.feature("Shop");
        await allure.story("Checkout (Excel)");
        await shop.inventory.open();
    });

    test("only rows flagged executor=Y are executed", () => {
        expect(customers.map((c) => c.caseId)).toEqual(["CHK-01", "CHK-02", "CHK-04"]);
    });

    for (const customer of customers) {
        test(`${customer.caseId}: ${customer.firstName} buys ${customer.product}`, async ({
            shop,
            assertion,
            page,
        }) => {
            await shop.inventory.addToCart(customer.product);
            await shop.inventory.openCart();
            await shop.cart.checkout();

            await shop.checkoutInfo.fill(customer);
            await shop.checkoutInfo.continue();
            await assertion.assertCount(shop.checkoutOverview.items, 1);
            await assertion.assertContainsText(shop.checkoutOverview.items, customer.product);

            await shop.checkoutOverview.finish();
            await assertion.assertURLContains(page, "/checkout-complete.html");
            await assertion.assertText(shop.checkoutComplete.header, "Thank you for your order!");
        });
    }
});
