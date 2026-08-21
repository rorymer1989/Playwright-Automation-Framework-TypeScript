import { logger } from "../../utilities/logger";
import fs from "node:fs";
import path from "node:path";

export interface ReportArchive {
    filename: string;
    path: string;
}

async function zipDirectory(sourceDir: string, outputZip: string): Promise<void> {
    // archiver >= 8 is ESM-only; load it dynamically from this CommonJS project.
    const { ZipArchive } = await import("archiver");

    await new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(outputZip);
        const archive = new ZipArchive({ zlib: { level: 9 } });

        output.on("close", () => {
            logger.info(`✅ Created ${outputZip}`);
            resolve();
        });
        archive.on("error", reject);

        archive.pipe(output);
        archive.directory(sourceDir, false);
        void archive.finalize();
    });
}

/**
 * Zips playwright-report/ and allure-report/ (whichever exist) into reports/
 * and returns the list of archives created.
 */
export async function zipExecutionReports(
    outputDir = path.join(process.cwd(), "reports")
): Promise<ReportArchive[]> {
    fs.mkdirSync(outputDir, { recursive: true });

    const candidates: Array<[dir: string, filename: string]> = [
        ["playwright-report", "PlaywrightReport.zip"],
        ["allure-report", "AllureReport.zip"],
    ];

    const archives: ReportArchive[] = [];
    for (const [dir, filename] of candidates) {
        const sourceDir = path.join(process.cwd(), dir);
        if (!fs.existsSync(sourceDir)) continue;

        const target = path.join(outputDir, filename);
        await zipDirectory(sourceDir, target);
        archives.push({ filename, path: target });
    }
    return archives;
}
