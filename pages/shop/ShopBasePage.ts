import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";
import { ENV } from "../../config/environment";

/** Common header (cart badge, menu) shared by every page after login. */
export abstract class ShopBasePage extends BasePage {
    readonly title: Locator;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly menuButton: Locator;
    readonly logoutLink: Locator;
    readonly resetAppStateLink: Locator;

    protected abstract readonly path: string;

    constructor(page: Page) {
        super(page);
        this.title = page.getByTestId("title");
        this.cartLink = page.getByTestId("shopping-cart-link");
        this.cartBadge = page.getByTestId("shopping-cart-badge");
        this.menuButton = page.getByRole("button", { name: "Open Menu" });
        this.logoutLink = page.getByTestId("logout-sidebar-link");
        this.resetAppStateLink = page.getByTestId("reset-sidebar-link");
    }

    async open(): Promise<void> {
        await this.goto(`${ENV.shopUrl}${this.path}`);
    }

    async openCart(): Promise<void> {
        await this.cartLink.click();
    }

    async logout(): Promise<void> {
        await this.menuButton.click();
        await this.logoutLink.click();
    }

    /** Empties the cart server-side state kept by the app (menu → Reset App State). */
    async resetAppState(): Promise<void> {
        await this.menuButton.click();
        await this.resetAppStateLink.click();
        await this.page.getByRole("button", { name: "Close Menu" }).click();
    }
}
