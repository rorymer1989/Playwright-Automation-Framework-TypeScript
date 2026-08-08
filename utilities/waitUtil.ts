import type { Page } from "@playwright/test";

/**
 * Wait until page is completely ready
 */

export async function waitForPageReady(
    page: Page,
    timeout = 30000
): Promise<void> {

    // DOM Loaded
    await page.waitForLoadState("domcontentloaded", {
        timeout
    });

    // Network Idle
    await page.waitForLoadState("networkidle", {
        timeout
    });

    // Common Loader
    const loader = page.locator(".loader");

    if (await loader.count()) {

        await loader.waitFor({

            state: "hidden",

            timeout

        });

    }

    // Common Spinner
    const spinner = page.locator(".spinner");

    if (await spinner.count()) {

        await spinner.waitFor({

            state: "hidden",

            timeout

        });

    }

}