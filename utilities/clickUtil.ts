import type { Locator } from "@playwright/test";

export interface SmartClickOptions {
    /** Per-action timeout in ms. Defaults to `use.actionTimeout` from playwright.config.ts. */
    timeout?: number;
    /** Bypass actionability checks (use sparingly — it hides real problems). */
    force?: boolean;
}

/**
 * Click wrapper. Playwright's `locator.click()` already waits for the element
 * to be attached, visible, stable, enabled and to receive pointer events, and
 * scrolls it into view — so this adds no manual waits or retry loops on top:
 * a click that needs retries is a flaky locator or app and should surface as such.
 */
export async function smartClick(
    locator: Locator,
    { timeout, force }: SmartClickOptions = {}
): Promise<void> {
    await locator.click({ timeout, force });
}
