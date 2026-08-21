import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { smartFill } from "../utilities/fillUtil";
import { smartClick } from "../utilities/clickUtil";
import { ENV } from "../config/environment";

export class LoginPage extends BasePage {
    readonly username: Locator;
    readonly password: Locator;
    readonly submit: Locator;
    readonly flash: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.getByLabel("Username");
        this.password = page.getByLabel("Password");
        this.submit = page.getByRole("button", { name: "Login" });
        this.flash = page.locator("#flash");
    }

    async open(): Promise<void> {
        await this.goto(`${ENV.authUrl}/login`);
    }

    async login(username: string, password: string): Promise<void> {
        await smartFill(this.username, username);
        await smartFill(this.password, password);
        await smartClick(this.submit);
    }
}
