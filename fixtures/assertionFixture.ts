import type { Locator, Page } from "@playwright/test";
import SoftAssertionUtilClass from "../utilities/softAssertionUtil";

interface AssertionUtil {
    assertVisible(locator: Locator): Promise<void>;
    assertHidden(locator: Locator): Promise<void>;
    assertText(locator: Locator, expected: string): Promise<void>;
    assertURL(page: Page, url: string): Promise<void>;
}

interface SoftAssertionUtil {
}

export class Assertions {

    soft: SoftAssertionUtil;

    constructor() {

        this.soft = new SoftAssertionUtilClass();

    }

    async assertVisible(locator: Locator): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async assertHidden(locator: Locator): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async assertText(locator: Locator, expected: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async assertURL(page: Page, url: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
