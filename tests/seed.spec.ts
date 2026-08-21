/**
 * Seed for Playwright Test Agents (planner / generator / healer).
 * Generated tests inherit everything in this file: import `test` from the
 * framework fixture (NOT from @playwright/test), use page objects through the
 * `shop` fixture, data through `data`, assertions through `assertion`, and tag
 * the Jira story in the describe title + allure.issue().
 */
import { test } from "../fixtures/baseFixture";

test.describe("Test group @SCRUM-0", () => {
    test.beforeEach(async ({ allure, shop }) => {
        await allure.feature("Shop");
        await allure.issue("SCRUM-0");
        await shop.inventory.open(); // authenticated as standard_user via storageState
    });

    test("seed", async ({ shop, assertion, data }) => {
        // generate code here.
        void data.load("shop");
        await assertion.assertVisible(shop.inventory.title);
    });
});
