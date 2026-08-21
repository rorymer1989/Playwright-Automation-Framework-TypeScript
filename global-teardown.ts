import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

import { writeEnvironment } from "./reporting/allure/environmentWriter";
import { logger } from "./utilities/logger";

export default function globalTeardown(): void {
    // CI shards only collect results; the merge-reports job generates the report once.
    if (process.env.SKIP_ALLURE_REPORT) {
        writeEnvironment();
        return;
    }

    logger.section("Generating Allure Report...");

    try {
        writeEnvironment();

        const reportHistory = path.join(process.cwd(), "allure-report", "history");
        const resultsHistory = path.join(process.cwd(), "allure-results", "history");

        if (fs.existsSync(reportHistory)) {
            fs.mkdirSync(resultsHistory, { recursive: true });
            fs.cpSync(reportHistory, resultsHistory, {
                recursive: true,
                force: true,
            });

            logger.info("Previous Allure history copied.");
        } else {
            logger.info("No previous Allure history found. Trend will start from this execution.");
        }

        execSync("npx allure generate allure-results --clean -o allure-report", {
            stdio: "inherit",
        });

        logger.info("✅ Allure report generated.\n");
    } catch (error: unknown) {
        logger.warn("Unable to generate Allure report (requires Java + allure-commandline):");
        logger.warn(`   ${error instanceof Error ? error.message : String(error)}`);
    }
}
