import { test } from "../../fixtures/baseFixture";
import { LoginPage } from "../../pages";

interface Users {
    standard: { username: string; password: string };
    invalid: { username: string; password: string };
}

test.describe("Authentication", () => {
    test.beforeEach(async ({ allure }) => {
        await allure.feature("Authentication");
    });

    test("authenticated state from setup gives direct access to the secure area", async ({
        secureAreaPage,
        assertion,
        page,
    }) => {
        // No login here: the storageState produced by tests/auth.setup.ts is already loaded.
        await secureAreaPage.open();

        await assertion.assertURLContains(page, "/secure");
        await assertion.assertVisible(secureAreaPage.heading);
        await assertion.assertVisible(secureAreaPage.logout);
    });

    test("invalid credentials show an error and stay on the login page", async ({
        browser,
        data,
        assertion,
    }) => {
        // Fresh context WITHOUT the saved storageState
        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        const { invalid } = data.load<Users>("users");

        try {
            await loginPage.open();
            await loginPage.login(invalid.username, invalid.password);

            await assertion.assertURLContains(page, "/login");
            await assertion.assertContainsText(loginPage.flash, "Your password is invalid!");
        } finally {
            await context.close();
        }
    });

    test("logout clears the session", async ({ secureAreaPage, loginPage, assertion, actions, page }) => {
        await secureAreaPage.open();
        await actions.smartClick(secureAreaPage.logout);

        await assertion.assertURLContains(page, "/login");
        await assertion.assertContainsText(loginPage.flash, "You logged out of the secure area!");

        // Session is gone: the secure area now redirects to /login
        await secureAreaPage.open();
        await assertion.assertURLContains(page, "/login");
    });
});
