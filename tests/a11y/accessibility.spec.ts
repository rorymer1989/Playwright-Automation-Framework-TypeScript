import { test, expect } from "../../fixtures/baseFixture";

/**
 * Known issue on the demo site (the-internet.herokuapp.com): the footer link fails
 * `color-contrast` (serious). Disable that rule explicitly, with a reference, instead of
 * lowering the bar globally — any *new* violation still fails the test.
 */
const KNOWN_ISSUES = { disableRules: ["color-contrast"] }; // DEMO-123: footer link contrast

test.describe("Accessibility (axe-core, WCAG 2.1 A/AA)", () => {
    test.beforeEach(async ({ allure }) => {
        await allure.feature("Accessibility");
    });

    test("login page has no WCAG violations", async ({ loginPage, a11y }) => {
        await loginPage.open();
        await a11y.check(KNOWN_ISSUES);
    });

    test("secure area has no WCAG violations", async ({ secureAreaPage, a11y }) => {
        await secureAreaPage.open();
        await a11y.check(KNOWN_ISSUES);
    });

    test("login page: the known contrast issue is the only violation", async ({ loginPage, a11y }) => {
        // Guards the allow-list above: if the site fixes it, this test tells us to remove the exception.
        await loginPage.open();
        const violations = await a11y.scan();
        expect(violations.map((v) => v.id)).toEqual(["color-contrast"]);
    });

    test("playwright.dev home: scan and report, excluding third-party widgets", async ({
        homePage,
        a11y,
    }) => {
        await homePage.open();

        // `scan` returns violations without failing — useful for audits / triage.
        const violations = await a11y.scan({ exclude: ["iframe"], tags: ["wcag2a", "wcag2aa"] });
        const critical = violations.filter((v) => v.impact === "critical");

        expect(
            critical,
            `Critical violations:\n${critical.map((v) => `${v.id}: ${v.help}`).join("\n")}`
        ).toEqual([]);
    });
});

/**
 * Known issue on saucedemo.com: the sort <select> has no accessible name
 * (`select-name`, critical). Excluded explicitly and guarded below.
 */
const SHOP_KNOWN_ISSUES = { disableRules: ["select-name"] }; // DEMO-124: product sort select has no label

test.describe("Shop accessibility", () => {
    test.beforeEach(async ({ allure, shop }) => {
        await allure.feature("Accessibility");
        await shop.inventory.open();
    });

    test("product catalogue has no WCAG violations besides the known ones", async ({ a11y }) => {
        await a11y.check(SHOP_KNOWN_ISSUES);
    });

    test("product catalogue: the known issue is the only critical violation", async ({ a11y }) => {
        const critical = (await a11y.scan()).filter((v) => v.impact === "critical");
        expect(critical.map((v) => v.id)).toEqual(["select-name"]);
    });
});
