import { expect, test } from "@playwright/test";
import type { APIResponse, Locator, Page } from "@playwright/test";

/**
 * Hard assertions, each wrapped in a `test.step` so the intent shows up in the
 * HTML/Allure report and trace viewer instead of stdout. `box: true` makes a
 * failure point at the caller's line rather than at this helper.
 */
async function step(title: string, assertion: () => Promise<void> | void): Promise<void> {
    await test.step(title, assertion, { box: true });
}

export class Assertion {
    /* ---- Element ----------------------------------------------------- */

    static assertVisible(locator: Locator, message = "Element should be visible"): Promise<void> {
        return step(message, () => expect(locator).toBeVisible());
    }

    static assertHidden(locator: Locator, message = "Element should be hidden"): Promise<void> {
        return step(message, () => expect(locator).toBeHidden());
    }

    static assertEnabled(locator: Locator, message = "Element should be enabled"): Promise<void> {
        return step(message, () => expect(locator).toBeEnabled());
    }

    static assertDisabled(locator: Locator, message = "Element should be disabled"): Promise<void> {
        return step(message, () => expect(locator).toBeDisabled());
    }

    static assertEditable(locator: Locator, message = "Element should be editable"): Promise<void> {
        return step(message, () => expect(locator).toBeEditable());
    }

    static assertChecked(locator: Locator, message = "Checkbox should be checked"): Promise<void> {
        return step(message, () => expect(locator).toBeChecked());
    }

    static assertFocused(locator: Locator, message = "Element should be focused"): Promise<void> {
        return step(message, () => expect(locator).toBeFocused());
    }

    /* ---- Text -------------------------------------------------------- */

    static assertText(locator: Locator, expected: string | RegExp): Promise<void> {
        return step(`Text should be ${String(expected)}`, () => expect(locator).toHaveText(expected));
    }

    static assertContainsText(locator: Locator, expected: string | RegExp): Promise<void> {
        return step(`Text should contain ${String(expected)}`, () => expect(locator).toContainText(expected));
    }

    static assertValue(locator: Locator, expected: string | RegExp): Promise<void> {
        return step(`Value should be ${String(expected)}`, () => expect(locator).toHaveValue(expected));
    }

    static assertPlaceholder(locator: Locator, placeholder: string | RegExp): Promise<void> {
        return step(`Placeholder should be ${String(placeholder)}`, () =>
            expect(locator).toHaveAttribute("placeholder", placeholder)
        );
    }

    /* ---- Page -------------------------------------------------------- */

    static assertTitle(page: Page, title: string | RegExp): Promise<void> {
        return step(`Title should be ${String(title)}`, () => expect(page).toHaveTitle(title));
    }

    static assertTitleContains(page: Page, title: string): Promise<void> {
        return step(`Title should contain "${title}"`, () => expect(page).toHaveTitle(new RegExp(title)));
    }

    static assertURL(page: Page, url: string | RegExp): Promise<void> {
        return step(`URL should be ${String(url)}`, () => expect(page).toHaveURL(url));
    }

    static assertURLContains(page: Page, text: string): Promise<void> {
        return step(`URL should contain "${text}"`, () => expect(page).toHaveURL(new RegExp(text)));
    }

    /* ---- Count / attributes ------------------------------------------ */

    static assertCount(locator: Locator, expectedCount: number): Promise<void> {
        return step(`Count should be ${expectedCount}`, () => expect(locator).toHaveCount(expectedCount));
    }

    static assertAttribute(locator: Locator, attribute: string, value: string | RegExp): Promise<void> {
        return step(`Attribute "${attribute}" should be ${String(value)}`, () =>
            expect(locator).toHaveAttribute(attribute, value)
        );
    }

    static assertClass(locator: Locator, className: string | RegExp): Promise<void> {
        return step(`Class should match ${String(className)}`, () => expect(locator).toHaveClass(className));
    }

    /* ---- Generic ----------------------------------------------------- */

    static assertTrue(value: unknown, message = "Expected value to be true"): void {
        expect(value, message).toBeTruthy();
    }

    static assertFalse(value: unknown, message = "Expected value to be false"): void {
        expect(value, message).toBeFalsy();
    }

    static assertEqual<T>(actual: T, expected: T): void {
        expect(actual).toBe(expected);
    }

    static assertNotEqual<T>(actual: T, expected: T): void {
        expect(actual).not.toBe(expected);
    }

    static assertContains(actual: string | readonly unknown[], expected: unknown): void {
        expect(actual).toContain(expected);
    }

    static assertNotContains(actual: string | readonly unknown[], expected: unknown): void {
        expect(actual).not.toContain(expected);
    }

    static assertGreaterThan(actual: number | bigint, expected: number | bigint): void {
        expect(actual).toBeGreaterThan(expected);
    }

    static assertLessThan(actual: number | bigint, expected: number | bigint): void {
        expect(actual).toBeLessThan(expected);
    }

    /* ---- API --------------------------------------------------------- */

    static assertStatus(response: APIResponse, expectedStatus: number): void {
        expect(response.status(), `${response.url()} status`).toBe(expectedStatus);
    }

    static assertJsonValue(response: APIResponse, key: string, expectedValue: unknown): Promise<void> {
        return step(`JSON "${key}" should be ${String(expectedValue)}`, async () => {
            const body: unknown = await response.json();
            if (typeof body !== "object" || body === null || !(key in body)) {
                throw new Error(`Response JSON does not contain key "${key}"`);
            }
            expect((body as Record<string, unknown>)[key]).toBe(expectedValue);
        });
    }
}
