import type { Locator } from "@playwright/test";

export interface ClickWithScrollOptions {
    maxScrolls?: number;
    scrollStep?: number;
}

/**
 * Finds a button by accessible name inside a horizontally scrollable container,
 * scrolling right step by step until it becomes visible, then clicks it.
 */
export async function clickWithScroll(
    container: Locator,
    text: string,
    { maxScrolls = 15, scrollStep = 500 }: ClickWithScrollOptions = {}
): Promise<void> {
    const button = container.getByRole("button", { name: text }).first();

    await container.evaluate((el) => {
        el.scrollLeft = 0;
    });

    for (let i = 0; i <= maxScrolls; i++) {
        if (await button.isVisible()) {
            await button.click();
            return;
        }
        await container.evaluate((el, step) => {
            el.scrollLeft += step;
        }, scrollStep);
        await container.page().waitForTimeout(100);
    }

    throw new Error(`Button not found after scrolling: "${text}"`);
}
