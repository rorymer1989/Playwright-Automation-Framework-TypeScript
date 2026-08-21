import fs from "node:fs";
import path from "node:path";
import { printExecutionDashboard } from "./utilities/dashboardUtil";
import { logger } from "./utilities/logger";

export default function globalSetup(): void {
    printExecutionDashboard();
    logger.section("🚀 Playwright Framework Initialization");

    const folders = ["allure-results", "allure-report", "playwright-report", "test-results"];

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
