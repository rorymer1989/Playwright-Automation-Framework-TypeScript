import { smartClick } from "../utilities/clickUtil";
import { smartFill } from "../utilities/fillUtil";
import { waitForPageReady } from "../utilities/waitUtil";
import type { Locator, Page } from "@playwright/test";

export interface ActionsInterface {
    smartClick(locator: Locator): Promise<void>;
    smartFill(locator: Locator, value: string): Promise<void>;
    waitForPageReady(page: Page): Promise<void>;
}

export class Actions implements ActionsInterface {

    async smartClick(locator: Locator): Promise<void> {
        await smartClick(locator);
    }

    async smartFill(locator: Locator, value: string): Promise<void> {
        await smartFill(locator, value);
    }

    async waitForPageReady(page: Page): Promise<void> {
        await waitForPageReady(page);
    }

}