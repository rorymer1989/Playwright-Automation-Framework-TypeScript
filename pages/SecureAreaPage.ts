import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ENV } from "../config/environment";

export class SecureAreaPage extends BasePage {
    readonly heading: Locator;
    readonly flash: Locator;
    readonly logout: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole("heading", { name: "Secure Area", exact: true });
        this.flash = page.locator("#flash");
        this.logout = page.getByRole("link", { name: "Logout" });
    }

    /** Direct navigation — only works with an authenticated storageState. */
    async open(): Promise<void> {
        await this.goto(`${ENV.authUrl}/secure`);
    }
}
