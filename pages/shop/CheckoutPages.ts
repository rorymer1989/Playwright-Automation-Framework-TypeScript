import type { Locator, Page } from "@playwright/test";
import { ShopBasePage } from "./ShopBasePage";
import { smartFill } from "../../utilities/fillUtil";

export interface CustomerInfo {
    firstName: string;
    lastName: string;
    postalCode: string;
}

const money = (text: string): number => Number(text.replace(/[^\d.]/g, ""));

/** Step one: customer information. */
export class CheckoutInfoPage extends ShopBasePage {
    protected readonly path = "/checkout-step-one.html";
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly error: Locator;

    constructor(page: Page) {
        super(page);
        this.firstName = page.getByTestId("firstName");
        this.lastName = page.getByTestId("lastName");
        this.postalCode = page.getByTestId("postalCode");
        this.continueButton = page.getByTestId("continue");
        this.cancelButton = page.getByTestId("cancel");
        this.error = page.getByTestId("error");
    }

    async fill(info: Partial<CustomerInfo>): Promise<void> {
        if (info.firstName !== undefined) await smartFill(this.firstName, info.firstName);
        if (info.lastName !== undefined) await smartFill(this.lastName, info.lastName);
        if (info.postalCode !== undefined) await smartFill(this.postalCode, info.postalCode);
    }

    async continue(): Promise<void> {
        await this.continueButton.click();
    }
}

/** Step two: order overview with totals. */
export class CheckoutOverviewPage extends ShopBasePage {
    protected readonly path = "/checkout-step-two.html";
    readonly items: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page);
        this.items = page.getByTestId("inventory-item");
        this.subtotalLabel = page.getByTestId("subtotal-label");
        this.taxLabel = page.getByTestId("tax-label");
        this.totalLabel = page.getByTestId("total-label");
        this.finishButton = page.getByTestId("finish");
        this.cancelButton = page.getByTestId("cancel");
    }

    async totals(): Promise<{ subtotal: number; tax: number; total: number }> {
        return {
            subtotal: money(await this.subtotalLabel.innerText()),
            tax: money(await this.taxLabel.innerText()),
            total: money(await this.totalLabel.innerText()),
        };
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }
}

/** Confirmation. */
export class CheckoutCompletePage extends ShopBasePage {
    protected readonly path = "/checkout-complete.html";
    readonly header: Locator;
    readonly text: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.header = page.getByTestId("complete-header");
        this.text = page.getByTestId("complete-text");
        this.backHomeButton = page.getByTestId("back-to-products");
    }
}
