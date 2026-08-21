import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DocsPage extends BasePage {
    readonly installationHeading: Locator;
    readonly sidebar: Locator;

    constructor(page: Page) {
        super(page);
        this.installationHeading = page.getByRole("heading", { name: "Installation" });
        this.sidebar = page.getByRole("navigation", { name: "Docs sidebar" });
    }

    sidebarLink(name: string): Locator {
        return this.sidebar.getByRole("link", { name, exact: true });
    }
}
