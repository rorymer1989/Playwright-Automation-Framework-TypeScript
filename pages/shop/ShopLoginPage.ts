import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";
import { ENV } from "../../config/environment";
import { smartFill } from "../../utilities/fillUtil";

export class ShopLoginPage extends BasePage {
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly error: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.getByTestId("username");
        this.password = page.getByTestId("password");
        this.loginButton = page.getByRole("button", { name: "Login" });
        this.error = page.getByTestId("error");
    }

    async open(): Promise<void> {
        await this.goto(`${ENV.shopUrl}/`);
    }

    async login(username: string, password: string): Promise<void> {
        await smartFill(this.username, username);
        await smartFill(this.password, password);
        await this.loginButton.click();
    }
}
