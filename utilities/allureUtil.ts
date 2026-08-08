interface AllureApi {
    feature(name: string): Promise<void>;
    story(name: string): Promise<void>;
    severity(level: string): Promise<void>;
    owner(name: string): Promise<void>;
    tags(...names: string[]): Promise<void>;
    description(text: string): Promise<void>;
}

const { allure }: { allure: AllureApi } = require("allure-playwright");

class AllureUtil {

    async feature(name: string): Promise<void> {
        await allure.feature(name);
    }

    async story(name: string): Promise<void> {
        await allure.story(name);
    }

    async severity(level: string): Promise<void> {
        await allure.severity(level);
    }

    async owner(name: string): Promise<void> {
        await allure.owner(name);
    }

    async tag(name: string): Promise<void> {
        await allure.tags(name);
    }

    async description(text: string): Promise<void> {
        await allure.description(text);
    }

}

module.exports = new AllureUtil();