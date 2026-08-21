import type { Page } from "@playwright/test";

export interface WaitForPageReadyOptions {
    timeout?: number;
    /** Extra CSS selectors for app-specific loaders/spinners to wait for. */
    loaderSelectors?: string[];
}

const DEFAULT_LOADER_SELECTORS = [".loader", ".spinner"];

/**
 * Wait until the page is ready for interaction.
 *
 * Deliberately avoids `networkidle` (discouraged by Playwright: sites with
 * polling/analytics never reach it). Instead waits for the `load` event plus
 * any known loader/spinner overlays to disappear.
 */
export async function waitForPageReady(
    page: Page,
    { timeout = 30_000, loaderSelectors = [] }: WaitForPageReadyOptions = {}
): Promise<void> {
    await page.waitForLoadState("domcontentloaded", { timeout });
    await page.waitForLoadState("load", { timeout });

    const selectors = [...DEFAULT_LOADER_SELECTORS, ...loaderSelectors];
    await Promise.all(
        selectors.map((selector) => page.locator(selector).first().waitFor({ state: "hidden", timeout }))
    );
}
