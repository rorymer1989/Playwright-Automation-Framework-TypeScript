import { test as base } from "@playwright/test";
import { Actions } from "./actionFixture";
import { Assertions } from "./assertionFixture";
import dataManager from "../utilities/dataManager";
import allureUtil from "../reporting/allure/allureUtil";
import stepUtil from "../reporting/allure/stepUtil";
import { HomePage, DocsPage } from "../pages";

interface CustomFixtures {
    homePage: HomePage;
    docsPage: DocsPage;
    actions: Actions;
    assertion: Assertions;
    data: typeof dataManager;
    allure: typeof allureUtil;
    step: typeof stepUtil.step;
}

export const test = base.extend<CustomFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    docsPage: async ({ page }, use) => {
        await use(new DocsPage(page));
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
});

export { expect } from "@playwright/test";
