import fs from "node:fs";
import path from "node:path";
import { printExecutionDashboard } from "./utilities/dashboardUtil";

export default async function globalSetup(): Promise<void> {
    printExecutionDashboard();
    console.log("\n========================================");
    console.log("🚀 Playwright Framework Initialization");
    console.log("========================================");

    const folders = [
        "allure-results",
        "allure-report",
        "playwright-report",
        "test-results"
    ];

    folders.forEach((folder: string) => {
        const folderPath = path.join(process.cwd(), folder);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`✅ Created Folder : ${folder}`);
        } else {
            console.log(`📁 Folder Exists : ${folder}`);
        }
    });

    console.log("\n✅ Reporting folders initialized successfully.");
    console.log("========================================\n");
}
