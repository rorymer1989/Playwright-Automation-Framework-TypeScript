interface AllureUtilInterface {
    epic(name: string): Promise<void>;
    feature(name: string): Promise<void>;
    story(name: string): Promise<void>;
    owner(name: string): Promise<void>;
    severity(level: string): Promise<void>;
    tag(...tags: string[]): Promise<void>;
    description(text: string): Promise<void>;
    suite(name: string): Promise<void>;
    subSuite(name: string): Promise<void>;
    applyDefaults(): Promise<void>;
}

import { allure as allureApi } from "allure-playwright";
import { DEFAULT_ALLURE_METADATA } from "./defaultMetadata";

class AllureUtil implements AllureUtilInterface {

    async epic(name: string): Promise<void> {
        await allureApi.epic(name);
    }

    async feature(name: string): Promise<void> {
        await allureApi.feature(name);
    }

    async story(name: string): Promise<void> {
        await allureApi.story(name);
    }

    async owner(name: string): Promise<void> {
        await allureApi.owner(name);
    }

    async severity(level: string): Promise<void> {
        await allureApi.severity(level);
    }

    async tag(...tags: string[]): Promise<void> {
        await allureApi.tags(...tags);
    }

    async description(text: string): Promise<void> {
        await allureApi.description(text);
    }

    async suite(name: string): Promise<void> {
        await allureApi.parentSuite(name);
    }

    async subSuite(name: string): Promise<void> {
        await allureApi.suite(name);
    }

    /** Applies owner/severity/epic from reporting/allure/defaultMetadata.ts */
    async applyDefaults(): Promise<void> {
        await allureApi.owner(DEFAULT_ALLURE_METADATA.owner);
        await allureApi.severity(DEFAULT_ALLURE_METADATA.severity);
        await allureApi.epic(DEFAULT_ALLURE_METADATA.epic);
        await allureApi.label("framework", DEFAULT_ALLURE_METADATA.framework);
    }

}

const allureUtil = new AllureUtil();
export default allureUtil;