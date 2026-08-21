import { test } from "../../fixtures/baseFixture";

/**
 * Baselines are stored per browser and OS in tests/visual/__snapshots__/visual.spec.ts/.
 * First run (or after an intended UI change): `npm run test:visual:update`.
 */
test.describe("Visual regression", () => {
    test.beforeEach(async ({ allure }) => {
        await allure.feature("Visual regression");
    });

    test("login page matches baseline", async ({ loginPage, visual, page }) => {
        await loginPage.open();
        await visual.match(page, "login-page", { fullPage: true });
    });

    test("login form component matches baseline", async ({ loginPage, visual }) => {
        await loginPage.open();
        await visual.match(loginPage.username.locator("xpath=ancestor::form"), "login-form");
    });

    test("secure area matches baseline (flash message masked)", async ({ secureAreaPage, visual, page }) => {
        await secureAreaPage.open();
        // The flash banner fades/varies; mask it instead of flaking on it.
        await visual.match(page, "secure-area", { mask: [secureAreaPage.flash] });
    });
});
