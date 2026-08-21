import { test as base } from "@playwright/test";
import { Actions } from "./actionFixture";
import { Assertions } from "./assertionFixture";
import dataManager from "../utilities/dataManager";
import allureUtil from "../reporting/allure/allureUtil";
import stepUtil from "../reporting/allure/stepUtil";
import { expectNoA11yViolations, scanA11y, type A11yOptions } from "../utilities/a11yUtil";
import { expectVisualMatch } from "../utilities/visualUtil";
import {
    HomePage,
    DocsPage,
    LoginPage,
    SecureAreaPage,
    ShopLoginPage,
    InventoryPage,
    CartPage,
    CheckoutInfoPage,
    CheckoutOverviewPage,
    CheckoutCompletePage,
    ProductDetailPage,
} from "../pages";

interface CustomFixtures {
    homePage: HomePage;
    docsPage: DocsPage;
    loginPage: LoginPage;
    secureAreaPage: SecureAreaPage;
    /** E-commerce demo page objects, grouped. */
    shop: {
        login: ShopLoginPage;
        inventory: InventoryPage;
        cart: CartPage;
        checkoutInfo: CheckoutInfoPage;
        checkoutOverview: CheckoutOverviewPage;
        checkoutComplete: CheckoutCompletePage;
        productDetail: ProductDetailPage;
    };
    actions: Actions;
    assertion: Assertions;
    data: typeof dataManager;
    allure: typeof allureUtil;
    step: typeof stepUtil.step;
    /** Accessibility: `a11y.check()` fails on WCAG violations, `a11y.scan()` only returns them. */
    a11y: {
        check: (options?: A11yOptions) => Promise<void>;
        scan: (options?: A11yOptions) => ReturnType<typeof scanA11y>;
    };
    /** Visual regression against per-browser baselines (see utilities/visualUtil.ts). */
    visual: { match: typeof expectVisualMatch };
}

export const test = base.extend<CustomFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    docsPage: async ({ page }, use) => {
        await use(new DocsPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    secureAreaPage: async ({ page }, use) => {
        await use(new SecureAreaPage(page));
    },
    shop: async ({ page }, use) => {
        await use({
            login: new ShopLoginPage(page),
            inventory: new InventoryPage(page),
            cart: new CartPage(page),
            checkoutInfo: new CheckoutInfoPage(page),
            checkoutOverview: new CheckoutOverviewPage(page),
            checkoutComplete: new CheckoutCompletePage(page),
            productDetail: new ProductDetailPage(page),
        });
    },
    actions: async ({}, use) => {
        await use(new Actions());
    },
    assertion: async ({}, use) => {
        await use(new Assertions());
    },
    data: async ({}, use) => {
        await use(dataManager);
    },
    allure: async ({}, use) => {
        await use(allureUtil);
    },
    step: async ({}, use) => {
        await use(stepUtil.step.bind(stepUtil));
    },
    a11y: async ({ page }, use) => {
        await use({
            check: (options) => expectNoA11yViolations(page, options),
            scan: (options) => scanA11y(page, options),
        });
    },
    visual: async ({}, use) => {
        await use({ match: expectVisualMatch });
    },
});

export { expect } from "@playwright/test";
