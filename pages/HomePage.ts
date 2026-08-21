import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { smartClick } from "../utilities/clickUtil";

export class HomePage extends BasePage {
    readonly getStartedLink: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        super(page);
        this.getStartedLink = page.getByRole("link", { name: "Get started" });
        this.searchButton = page.getByRole("button", { name: "Search" });
    }

    async open(): Promise<void> {
        await this.goto("/");
    }

    async clickGetStarted(): Promise<void> {
        await smartClick(this.getStartedLink);
    }
}
