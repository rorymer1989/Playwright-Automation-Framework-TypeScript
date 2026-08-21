import type { Locator, Page } from "@playwright/test";
import { Assertion } from "../utilities/assertionUtil";
import SoftAssertionUtil from "../utilities/softAssertionUtil";

export class Assertions {
    readonly soft: SoftAssertionUtil;

    constructor() {
        this.soft = new SoftAssertionUtil();
    }

    assertVisible(locator: Locator, message?: string): Promise<void> { return Assertion.assertVisible(locator, message); }
    assertHidden(locator: Locator, message?: string): Promise<void> { return Assertion.assertHidden(locator, message); }
    assertEnabled(locator: Locator, message?: string): Promise<void> { return Assertion.assertEnabled(locator, message); }
    assertDisabled(locator: Locator, message?: string): Promise<void> { return Assertion.assertDisabled(locator, message); }
    assertChecked(locator: Locator, message?: string): Promise<void> { return Assertion.assertChecked(locator, message); }
    assertText(locator: Locator, expected: string | RegExp): Promise<void> { return Assertion.assertText(locator, expected); }
    assertContainsText(locator: Locator, expected: string | RegExp): Promise<void> { return Assertion.assertContainsText(locator, expected); }
    assertValue(locator: Locator, expected: string | RegExp): Promise<void> { return Assertion.assertValue(locator, expected); }
    assertCount(locator: Locator, expected: number): Promise<void> { return Assertion.assertCount(locator, expected); }
    assertAttribute(locator: Locator, attr: string, value: string | RegExp): Promise<void> { return Assertion.assertAttribute(locator, attr, value); }
    assertTitle(page: Page, title: string | RegExp): Promise<void> { return Assertion.assertTitle(page, title); }
    assertURL(page: Page, url: string | RegExp): Promise<void> { return Assertion.assertURL(page, url); }
    assertURLContains(page: Page, text: string): Promise<void> { return Assertion.assertURLContains(page, text); }
}
