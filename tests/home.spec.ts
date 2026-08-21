import { test, expect } from "../fixtures/baseFixture";
import { takeScreenshot } from "../utilities/screenshotUtil";

interface HomeData {
    titlePattern: string;
    docsPath: string;
    installationHeading: string;
    sidebarLinks: string[];
}

test.describe("Playwright.dev — Home", () => {
    test.beforeEach(async ({ allure }) => {
        await allure.epic("Documentation site");
        await allure.feature("Home page");
        await allure.owner("QA Automation");
    });

    test("home page has the expected title", async ({ homePage, assertion, data, page }) => {
        const home = data.load<HomeData>("home");

        await homePage.open();
        await takeScreenshot(page, "Home", "HomePage");

        await assertion.assertTitle(page, new RegExp(home.titlePattern));
        await assertion.assertVisible(homePage.getStartedLink, "Get started link is visible");
    });

    test("Get started navigates to the installation docs", async ({
        homePage,
        docsPage,
        assertion,
        data,
        page,
    }) => {
        const home = data.load<HomeData>("home");

        await homePage.open();
        await homePage.clickGetStarted();
        await takeScreenshot(page, "GetStarted", "InstallationPage");

        await assertion.assertURLContains(page, home.docsPath);
        await assertion.assertVisible(docsPage.installationHeading);
        await assertion.assertText(docsPage.installationHeading, home.installationHeading);
    });

    test("docs sidebar lists the getting-started links (soft assertions)", async ({
        homePage,
        docsPage,
        assertion,
        data,
    }) => {
        const home = data.load<HomeData>("home");

        await homePage.open();
        await homePage.clickGetStarted();

        for (const name of home.sidebarLinks) {
            await assertion.soft.assertVisible(docsPage.sidebarLink(name), `Sidebar link "${name}" visible`);
        }
        assertion.soft.assertAll();

        expect(await docsPage.sidebar.getByRole("link").count()).toBeGreaterThan(home.sidebarLinks.length);
    });
});
