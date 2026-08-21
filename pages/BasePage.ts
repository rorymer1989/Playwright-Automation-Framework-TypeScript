import type { Page } from "@playwright/test";
import { waitForPageReady } from "../utilities/waitUtil";

export abstract class BasePage {
    constructor(protected readonly page: Page) {}

    /** Navigate relative to baseURL (playwright.config → use.baseURL) */
    async goto(relativePath = "/"): Promise<void> {
        await this.page.goto(relativePath);
        await waitForPageReady(this.page);
    }

    url(): string {
        return this.page.url();
    }
}
