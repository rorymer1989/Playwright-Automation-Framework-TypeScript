import type { Locator, Page } from "@playwright/test";
import { ShopBasePage } from "./ShopBasePage";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export interface ProductCard {
    name: string;
    price: number;
}

/** Turns a product name into the slug used by add-to-cart / remove test ids. */
export function productSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-");
}

export class InventoryPage extends ShopBasePage {
    protected readonly path = "/inventory.html";
    readonly items: Locator;
    readonly sortSelect: Locator;

    constructor(page: Page) {
        super(page);
        this.items = page.getByTestId("inventory-item");
        this.sortSelect = page.getByTestId("product-sort-container");
    }

    addToCartButton(name: string): Locator {
        return this.page.getByTestId(`add-to-cart-${productSlug(name)}`);
    }

    removeButton(name: string): Locator {
        return this.page.getByTestId(`remove-${productSlug(name)}`);
    }

    async addToCart(...names: string[]): Promise<void> {
        for (const name of names) await this.addToCartButton(name).click();
    }

    async removeFromCart(name: string): Promise<void> {
        await this.removeButton(name).click();
    }

    async sortBy(option: SortOption): Promise<void> {
        await this.sortSelect.selectOption(option);
    }

    async products(): Promise<ProductCard[]> {
        const names = await this.page.getByTestId("inventory-item-name").allTextContents();
        const prices = await this.page.getByTestId("inventory-item-price").allTextContents();
        return names.map((name, i) => ({ name, price: Number(prices[i].replace("$", "")) }));
    }
}
