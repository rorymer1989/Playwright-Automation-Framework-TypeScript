import { expect, type Locator } from "@playwright/test";

export interface SmartFillOptions {
    /** Per-action timeout in ms. Defaults to `use.actionTimeout` from playwright.config.ts. */
    timeout?: number;
    /** Skip the post-fill value check (e.g. inputs that mask or reformat their value). */
    verify?: boolean;
}

/**
 * Fill wrapper. `locator.fill()` already waits for the element to be visible,
 * enabled and editable, and clears it before typing. The extra value here is
 * the verification: an auto-retrying `toHaveValue` catches inputs that drop or
 * rewrite keystrokes (masks, async formatting, re-renders) without a manual loop.
 */
export async function smartFill(
    locator: Locator,
    value: string,
    { timeout, verify = true }: SmartFillOptions = {}
): Promise<void> {
    await locator.fill(value, { timeout });
    if (verify) {
        await expect(locator, "value should be set after fill").toHaveValue(value, { timeout });
    }
}
