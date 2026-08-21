import { test, expect } from "../../fixtures/baseFixture";
import { ShopLoginPage, InventoryPage } from "../../pages";
import type { ShopData } from "../../testData/shop.types";

/**
 * Controlled failures to exercise the framework's FAILURE paths end to end:
 * traces/videos/screenshots on failure, retries → flaky, soft-assertion
 * aggregation, visual diffs, Allure categories and a red email summary.
 *
 * Skipped unless DEMO_FAILURES=1 (locally: `npm run test:demo-failures`;
 * in CI: workflow_dispatch → "demo_failures"). These are EXPECTED to fail.
 */
// "standard" only when (re)generating the baseline; "problem" produces the diff.
const VISUAL_USER: "standard" | "problem" =
    process.env.VISUAL_BASELINE_USER === "standard" ? "standard" : "problem";

test.describe("Failure paths demo", () => {
    // eslint-disable-next-line playwright/no-skipped-test -- opt-in suite, see header comment
    test.skip(!process.env.DEMO_FAILURES, "Set DEMO_FAILURES=1 to run the failure demo");

    test.beforeEach(async ({ allure }) => {
        await allure.feature("Failure paths demo");
    });

    test("hard failure: wrong expectation produces trace, video and screenshot", async ({
        shop,
        assertion,
    }) => {
        await shop.inventory.open();
        await assertion.assertText(shop.inventory.title, "Not the real title");
    });

    test("soft failures are aggregated and reported together", async ({ shop, assertion, page }) => {
        await shop.inventory.open();
        await assertion.soft.assertText(shop.inventory.title, "Wrong 1", "first soft failure");
        await assertion.soft.assertVisible(
            shop.inventory.cartBadge,
            "badge should not be visible yet — second soft failure"
        );
        await assertion.soft.assertURL(page, /nowhere/, "third soft failure");
        assertion.soft.assertAll();
    });

    test("flaky: fails on the first attempt, passes on retry", async ({ shop, assertion }, testInfo) => {
        await shop.inventory.open();
        // With retries configured (CI: 2) this is reported as FLAKY, not failed.
        await assertion.assertText(
            shop.inventory.title,
            testInfo.retry === 0 ? "Flaky on first run" : "Products"
        );
    });

    test("visual diff: problem_user renders broken images", async ({ browser, data, visual }) => {
        const { users, password } = data.load<ShopData>("shop");
        // The baseline (tests/demo/__snapshots__) was captured with standard_user. problem_user is a
        // saucedemo persona whose catalogue shows wrong images → a real pixel diff against it.
        // Regenerate the baseline with: DEMO_FAILURES=1 VISUAL_BASELINE_USER=standard sh scripts/visual-docker.sh ... (see README)
        const user = users[VISUAL_USER];
        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();
        try {
            const login = new ShopLoginPage(page);
            await login.open();
            await login.login(user, password);
            await expect(new InventoryPage(page).title).toHaveText("Products");
            await visual.match(page, "inventory-standard-user", { fullPage: true });
        } finally {
            await context.close();
        }
    });

    test("timeout: element that never appears", async ({ shop, page }) => {
        await shop.inventory.open();
        await page.getByTestId("does-not-exist").click({ timeout: 3_000 });
    });
});
