import { test as setup, expect } from "../fixtures/baseFixture";
import { storageStatePath } from "../config/environment";
import type { ShopData } from "../testData/shop.types";

interface Users {
    standard: { username: string; password: string };
}

/**
 * Runs once per browser before its tests (see `dependencies` in playwright.config.ts).
 * Logs in through the UI of every app under test and persists cookies/localStorage to
 * .auth/<browser>.json — one context can hold sessions for several domains — so every
 * test starts already authenticated without repeating the login flows.
 */
setup("authenticate", async ({ loginPage, secureAreaPage, shop, data, page }, testInfo) => {
    // 1. the-internet (auth examples)
    const { standard } = data.load<Users>("users");
    await loginPage.open();
    await loginPage.login(standard.username, standard.password);
    await expect(secureAreaPage.heading).toBeVisible();

    // 2. saucedemo (e-commerce examples)
    const shopData = data.load<ShopData>("shop");
    await shop.login.open();
    await shop.login.login(shopData.users.standard, shopData.password);
    await expect(shop.inventory.title).toHaveText("Products");
    // "setup:chromium" → "chromium"
    const browser = testInfo.project.name.replace(/^setup:/, "");
    await page.context().storageState({ path: storageStatePath(browser) });
});
