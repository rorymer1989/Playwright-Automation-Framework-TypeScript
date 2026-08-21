import { test as setup, expect } from "../fixtures/baseFixture";
import { storageStatePath } from "../config/environment";

interface Users {
    standard: { username: string; password: string };
}

/**
 * Runs once per browser before its tests (see `dependencies` in playwright.config.ts).
 * Logs in through the UI and persists cookies/localStorage to .auth/<browser>.json so
 * every test starts already authenticated without repeating the login flow.
 */
setup("authenticate", async ({ loginPage, secureAreaPage, data, page }, testInfo) => {
    const { standard } = data.load<Users>("users");

    await loginPage.open();
    await loginPage.login(standard.username, standard.password);

    await expect(secureAreaPage.heading).toBeVisible();
    // "setup:chromium" → "chromium"
    const browser = testInfo.project.name.replace(/^setup:/, "");
    await page.context().storageState({ path: storageStatePath(browser) });
});
