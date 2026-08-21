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

    /** Card of a product, located by its exact name. */
    card(name: string): Locator {
        return this.items.filter({
            has: this.page.getByTestId("inventory-item-name").filter({ hasText: name }),
        });
    }

    async cardDetails(name: string): Promise<ProductCard & { description: string }> {
        const card = this.card(name);
        return {
            name: await card.getByTestId("inventory-item-name").innerText(),
            description: await card.getByTestId("inventory-item-desc").innerText(),
            price: Number((await card.getByTestId("inventory-item-price").innerText()).replace("$", "")),
        };
    }

    /** Opens the product detail page by clicking the card's name link. */
    async openProduct(name: string): Promise<void> {
        await this.card(name).getByTestId("inventory-item-name").click();
    }

    async sortBy(option: SortOption): Promise<void> {
        await this.sortSelect.selectOption(option);
    }

    /** Visible label of the currently selected sort option. */
    async selectedSortOption(): Promise<string> {
        return this.sortSelect.locator("option:checked").innerText();
    }

    async products(): Promise<ProductCard[]> {
        const names = await this.page.getByTestId("inventory-item-name").allTextContents();
        const prices = await this.page.getByTestId("inventory-item-price").allTextContents();
        return names.map((name, i) => ({ name, price: Number(prices[i].replace("$", "")) }));
    }
}
