import type { Locator, Page } from "@playwright/test";
import { smartClick, type SmartClickOptions } from "../utilities/clickUtil";
import { smartFill, type SmartFillOptions } from "../utilities/fillUtil";
import { waitForPageReady, type WaitForPageReadyOptions } from "../utilities/waitUtil";

/**
 * `actions` fixture: the single entry point for element interactions.
 * Everything is a thin wrapper over Playwright's auto-waiting Locator API;
 * `smartFill` additionally verifies the value after filling.
 */
export class Actions {
    // ---- Click / type -------------------------------------------------

    async smartClick(locator: Locator, options?: SmartClickOptions): Promise<void> {
        await smartClick(locator, options);
    }

    async smartFill(locator: Locator, value: string, options?: SmartFillOptions): Promise<void> {
        await smartFill(locator, value, options);
    }

    async forceClick(locator: Locator): Promise<void> {
        await locator.click({ force: true });
    }

    async doubleClick(locator: Locator): Promise<void> {
        await locator.dblclick();
    }

    async rightClick(locator: Locator): Promise<void> {
        await locator.click({ button: "right" });
    }

    async hover(locator: Locator): Promise<void> {
        await locator.hover();
    }

    async pressKey(locator: Locator, key: string): Promise<void> {
        await locator.press(key);
    }

    // ---- Form controls --------------------------------------------------

    async selectByValue(locator: Locator, value: string): Promise<void> {
        await locator.selectOption(value);
    }

    async selectByLabel(locator: Locator, label: string): Promise<void> {
        await locator.selectOption({ label });
    }

    /** Idempotent: only toggles when needed. */
    async setChecked(locator: Locator, checked: boolean): Promise<void> {
        await locator.setChecked(checked);
    }

    async uploadFile(locator: Locator, filePath: string | string[]): Promise<void> {
        await locator.setInputFiles(filePath);
    }

    // ---- Scroll / wait --------------------------------------------------

    async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    async waitForPageReady(page: Page, options?: WaitForPageReadyOptions): Promise<void> {
        await waitForPageReady(page, options);
    }

    async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
        await locator.waitFor({ state: "visible", timeout });
    }

    async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
        await locator.waitFor({ state: "hidden", timeout });
    }
}
