import fs from "node:fs";
import path from "node:path";
import { printExecutionDashboard } from "./utilities/dashboardUtil";
import { preflight } from "./utilities/preflight";
import { ENV } from "./config/environment";
import { logger } from "./utilities/logger";

export default async function globalSetup(): Promise<void> {
    printExecutionDashboard();

    await preflight([
        { name: "BASE_URL", url: ENV.baseUrl },
        { name: "AUTH_URL", url: ENV.authUrl },
        { name: "SHOP_URL", url: ENV.shopUrl },
        { name: "API_URL", url: ENV.apiUrl },
    ]);

    logger.section("🚀 Playwright Framework Initialization");

    const folders = ["allure-results", "allure-report", "playwright-report", "test-results"];

    // Allure results accumulate across runs otherwise, and the report (and its zip)
    // would contain every execution ever made. History is restored by the teardown
    // from allure-report/history, so the folder can be emptied safely.
    const allureResults = path.join(process.cwd(), "allure-results");
    if (fs.existsSync(allureResults) && !process.env.KEEP_ALLURE_RESULTS) {
        fs.rmSync(allureResults, { recursive: true, force: true });
        logger.debug("Cleared allure-results from previous run");
    }

    folders.forEach((folder: string) => {
        const folderPath = path.join(process.cwd(), folder);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            logger.info(`✅ Created folder: ${folder}`);
        } else {
            logger.debug(`Folder exists: ${folder}`);
        }
    });

    logger.info("✅ Reporting folders ready.\n");
}
