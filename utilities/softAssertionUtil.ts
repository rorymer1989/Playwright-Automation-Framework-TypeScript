import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

/**
 * Soft assertions: every check is recorded with `expect.soft`, so failures
 * don't stop the test and Playwright marks it failed at the end.
 * Call `assertAll()` when you want to stop early once any soft failure exists.
 */
class SoftAssertionUtil {

    async assertVisible(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator, message).toBeVisible();
    }

    async assertHidden(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator, message).toBeHidden();
    }

    async assertEnabled(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator, message).toBeEnabled();
    }

    async assertDisabled(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator, message).toBeDisabled();
    }

    async assertText(locator: Locator, expected: string | RegExp, message?: string): Promise<void> {
        await expect.soft(locator, message).toHaveText(expected);
    }

    async assertValue(locator: Locator, expected: string | RegExp, message?: string): Promise<void> {
        await expect.soft(locator, message).toHaveValue(expected);
    }

    async assertURL(page: Page, expected: string | RegExp, message?: string): Promise<void> {
        await expect.soft(page, message).toHaveURL(expected);
    }

    async assertTitle(page: Page, expected: string | RegExp, message?: string): Promise<void> {
        await expect.soft(page, message).toHaveTitle(expected);
    }

    /** Number of soft failures recorded so far in the current test. */
    failureCount(): number {
        return test.info().errors.length;
    }

    /** Stops the test now if any soft assertion has failed. */
    assertAll(): void {
        const failures = test.info().errors;
        if (failures.length > 0) {
            throw new Error(
                `${failures.length} soft assertion(s) failed:\n\n` +
                failures.map((e, i) => `${i + 1}. ${e.message ?? String(e)}`).join("\n\n")
            );
        }
    }
}

export default SoftAssertionUtil;
