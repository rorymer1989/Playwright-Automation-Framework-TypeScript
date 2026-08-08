import type { Locator, Page } from "@playwright/test";

interface AssertionUtil {
    assertVisible(locator: Locator): Promise<void>;
    assertHidden(locator: Locator): Promise<void>;
    assertText(locator: Locator, expected: string): Promise<void>;
    assertURL(page: Page, url: string): Promise<void>;
}

interface SoftAssertionUtil {
}

const Assertion: AssertionUtil = require("../utils/assertionUtil");
const SoftAssertionUtilClass: new () => SoftAssertionUtil = require("../utils/softAssertionUtil");

export class Assertions {

    soft: SoftAssertionUtil;

    constructor() {

        this.soft = new SoftAssertionUtilClass();

    }

    async assertVisible(locator: Locator): Promise<void> {
        await Assertion.assertVisible(locator);
    }

    async assertHidden(locator: Locator): Promise<void> {
        await Assertion.assertHidden(locator);
    }

    async assertText(locator: Locator, expected: string): Promise<void> {
        await Assertion.assertText(locator, expected);
    }

    async assertURL(page: Page, url: string): Promise<void> {
        await Assertion.assertURL(page, url);
    }

}

module.exports = Assertions;