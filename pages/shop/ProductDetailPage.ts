import type { Locator, Page } from "@playwright/test";
import { ShopBasePage } from "./ShopBasePage";
import type { ProductCard } from "./InventoryPage";

/** /inventory-item.html?id=<n> — single product with description and add/remove. */
export class ProductDetailPage extends ShopBasePage {
    protected readonly path = "/inventory-item.html";
    readonly container: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly addToCartButton: Locator;
    readonly removeButton: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByTestId("inventory-item");
        this.name = this.container.getByTestId("inventory-item-name");
        this.description = this.container.getByTestId("inventory-item-desc");
        this.price = this.container.getByTestId("inventory-item-price");
        this.addToCartButton = page.getByTestId("add-to-cart");
        this.removeButton = page.getByTestId("remove");
        this.backButton = page.getByTestId("back-to-products");
    }

    async openById(id: number): Promise<void> {
        await this.goto(`${this.baseUrl()}${this.path}?id=${id}`);
    }

    async product(): Promise<ProductCard & { description: string }> {
        return {
            name: await this.name.innerText(),
            description: await this.description.innerText(),
            price: Number((await this.price.innerText()).replace("$", "")),
        };
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    async backToProducts(): Promise<void> {
        await this.backButton.click();
    }
}
