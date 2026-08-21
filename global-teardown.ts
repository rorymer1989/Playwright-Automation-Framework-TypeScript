import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

import { writeEnvironment } from "./reporting/allure/environmentWriter";

export default function globalTeardown(): void {
    console.log("");
    console.log("========================================");
    console.log("Generating Allure Report...");
    console.log("========================================");

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

            console.log(" Previous Allure history copied.");
        } else {
            console.log("ℹ️ No previous Allure history found. Trend will start from this execution.");
        }

        execSync("npx allure generate allure-results --clean -o allure-report", {
            stdio: "inherit",
        });

        console.log("");
        console.log("✅ Allure Report Generated Successfully");
        console.log("");
    } catch (error: unknown) {
        console.warn("⚠️  Unable to generate Allure Report (requires Java + allure-commandline):");
        console.warn(`   ${error instanceof Error ? error.message : String(error)}`);
    }
}
