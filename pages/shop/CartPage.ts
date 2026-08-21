import type { Locator, Page } from "@playwright/test";
import { ShopBasePage } from "./ShopBasePage";
import { productSlug, type ProductCard } from "./InventoryPage";

export class CartPage extends ShopBasePage {
    protected readonly path = "/cart.html";
    readonly items: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        super(page);
        this.items = page.getByTestId("inventory-item");
        this.checkoutButton = page.getByTestId("checkout");
        this.continueShoppingButton = page.getByTestId("continue-shopping");
    }

    removeButton(name: string): Locator {
        return this.page.getByTestId(`remove-${productSlug(name)}`);
    }

    async lines(): Promise<ProductCard[]> {
        const names = await this.items.getByTestId("inventory-item-name").allTextContents();
        const prices = await this.items.getByTestId("inventory-item-price").allTextContents();
        return names.map((name, i) => ({ name, price: Number(prices[i].replace("$", "")) }));
    }

    async checkout(): Promise<void> {
        await this.checkoutButton.click();
    }
}
