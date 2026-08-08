import { test as base } from "@playwright/test";

import { Actions } from "./actionFixture";
import { Assertions } from "./assertionFixture";
const dataManager = require("../utils/dataManager");
const allureUtil = require("../reporting/allure/allureUtil");

interface CustomFixtures {
    actions: Actions;
    assertion: Assertions;
    data: typeof dataManager;
    allure: typeof allureUtil;
}

export const test = base.extend<CustomFixtures>({

    actions: async ({}, use) => {

        await use(new Actions());

    },

    assertion: async ({}, use: (assertions: Assertions) => Promise<void>): Promise<void> => {

        await use(new Assertions());

    },

    data: async ({}, use: (data: typeof dataManager) => Promise<void>) => {

        await use(dataManager);

    },

    allure: async ({}, use: (allure: typeof allureUtil) => Promise<void>): Promise<void> => {

        await use(allureUtil);

    },

});

export { expect } from "@playwright/test";