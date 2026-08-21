import fs from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";

/** Creates <basePath>/<folderName> (or `folderName` if absolute) and returns its path. */
export function createFolder(folderName: string, basePath = "reports"): string {
    if (!folderName) {
        throw new Error('createFolder: "folderName" must be a non-empty string.');
    }
    const folderPath = path.isAbsolute(folderName) ? folderName : path.join(basePath, folderName);
    fs.mkdirSync(folderPath, { recursive: true });
    return folderPath;
}

/** Clicks `trigger`, waits for the download and saves it to `filePath`. */
export async function downloadFile(page: Page, trigger: Locator, filePath: string): Promise<string> {
    const [download] = await Promise.all([page.waitForEvent("download"), trigger.click()]);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    await download.saveAs(filePath);
    return filePath;
}
