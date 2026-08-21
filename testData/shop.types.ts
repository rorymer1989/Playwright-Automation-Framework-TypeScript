import type { CustomerInfo } from "../pages/shop";

export interface ShopData {
    password: string;
    users: { standard: string; lockedOut: string; problem: string; performanceGlitch: string };
    loginErrors: { case: string; username: string; password: string; message: string }[];
    catalogSize: number;
    products: Record<"backpack" | "bikeLight" | "onesie", { name: string; price: number }>;
    taxRate: number;
    checkoutValidation: { case: string; info: Partial<CustomerInfo>; message: string }[];
}
