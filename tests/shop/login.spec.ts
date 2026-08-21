import { test, expect } from "../../fixtures/baseFixture";
import { ShopLoginPage, InventoryPage } from "../../pages";
import type { ShopData } from "../../testData/shop.types";
import dataManager from "../../utilities/dataManager";

// Loaded at module level so the data-driven cases can be declared as individual tests.
const shopData = dataManager.load<ShopData>("shop");

test.describe("Shop — login @SCRUM-1", () => {
    // These tests exercise the login form itself, so they must NOT start authenticated.
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ allure }) => {
        await allure.feature("Shop");
        await allure.issue("SCRUM-1");
        await allure.story("Login");
    });

    test("standard user lands on the product list", async ({ shop, assertion, page }) => {
        await shop.login.open();
        await shop.login.login(shopData.users.standard, shopData.password);

        await assertion.assertURLContains(page, "/inventory.html");
        await assertion.assertText(shop.inventory.title, "Products");
        await assertion.assertCount(shop.inventory.items, shopData.catalogSize);
    });

    for (const { case: name, username, password, message } of shopData.loginErrors) {
        test(`rejects ${name}`, async ({ shop, assertion, page }) => {
            await shop.login.open();
            await shop.login.login(username, password);

            await assertion.assertContainsText(shop.login.error, message);
            await assertion.assertURL(page, /saucedemo\.com\/?$/);
        });
    }

    test("logout returns to the login page and drops the session", async ({ browser, data }) => {
        const { users, password } = data.load<ShopData>("shop");
        const context = await browser.newContext();
        const page = await context.newPage();
        const login = new ShopLoginPage(page);
        const inventory = new InventoryPage(page);

        try {
            await login.open();
            await login.login(users.standard, password);
            await expect(inventory.title).toHaveText("Products");

            await inventory.logout();
            await expect(login.loginButton).toBeVisible();

            // Direct access without a session is redirected to login with an error
            await inventory.open();
            await expect(login.error).toContainText(
                "You can only access '/inventory.html' when you are logged in"
            );
        } finally {
            await context.close();
        }
    });
});
