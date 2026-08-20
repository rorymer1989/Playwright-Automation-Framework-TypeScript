import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

class SoftAssertionUtil {

    private failures: string[] = [];

    async recordAssertion(action: () => Promise<void>): Promise<void> {
        try {
            await action();
        } catch (error: unknown) {
            this.failures.push(error instanceof Error ? error.message : String(error));
        }
    }

    async assertVisible(locator: Locator, message = ""): Promise<void> {
        await this.recordAssertion(() => expect.soft(locator, message).toBeVisible());
    }

    async assertHidden(locator: Locator, message = ""): Promise<void> {
        await this.recordAssertion(() => expect.soft(locator, message).toBeHidden());
    }

    async assertEnabled(locator: Locator, message = ""): Promise<void> {
        await this.recordAssertion(() => expect.soft(locator, message).toBeEnabled());
    }

    async assertDisabled(locator: Locator, message = ""): Promise<void> {
        await this.recordAssertion(() => expect.soft(locator, message).toBeDisabled());
    }

    async assertText(locator: Locator, expected: string | RegExp, message = ""): Promise<void> {
        await this.recordAssertion(() => expect.soft(locator, message).toHaveText(expected));
    }

    async assertValue(locator: Locator, expected: string | RegExp, message = ""): Promise<void> {
        await this.recordAssertion(() => expect.soft(locator, message).toHaveValue(expected));
    }

    async assertURL(page: Page, expected: string | RegExp, message = ""): Promise<void> {
        await this.recordAssertion(() => expect.soft(page, message).toHaveURL(expected));
    }

    async assertTitle(page: Page, expected: string | RegExp, message = ""): Promise<void> {
        await this.recordAssertion(() => expect.soft(page, message).toHaveTitle(expected));
    }

    assertAll(): void {

        if (this.failures.length > 0) {

            throw new Error(
                "\nSoft Assertion Failures\n\n" +
                this.failures.join("\n\n")
            );

        }

    }

    clear(): void {
        this.failures = [];
    }

}

export default SoftAssertionUtil;