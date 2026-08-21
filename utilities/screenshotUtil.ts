import fs from "node:fs";
import path from "node:path";
import { test, type Page, type TestInfo } from "@playwright/test";

/** dd_mm_yyyy */
export function getCurrentDate(date: Date = new Date()): string {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${dd}_${mm}_${date.getFullYear()}`;
}

/**
 * Per-test screenshot counter. Keyed by testId so numbering is stable and
 * isolated when tests run in parallel workers (a module-level counter is not).
 */
const screenshotCounters = new Map<string, number>();

function nextScreenshotNumber(testId: string): string {
    const next = (screenshotCounters.get(testId) ?? 0) + 1;
    screenshotCounters.set(testId, next);
    return String(next).padStart(2, "0");
}

/**
 * Takes a full-page screenshot under Screenshots/<dd_mm_yyyy>/<caseName>/NN_<stepName>.jpg
 * and attaches it to the test report (HTML / Allure).
 *
 * Pass `testInfo` (from the test callback) for per-test numbering; falls back to
 * `test.info()` when called from within a running test.
 */
export async function takeScreenshot(
    page: Page,
    caseName: string,
    stepName: string,
    testInfo: TestInfo = test.info()
): Promise<string> {
    const caseDir = path.join("Screenshots", getCurrentDate(), caseName);
    fs.mkdirSync(caseDir, { recursive: true });

    const number = nextScreenshotNumber(testInfo.testId);
    const filePath = path.join(caseDir, `${number}_${stepName}.jpg`);

    const buffer = await page.screenshot({ path: filePath, fullPage: true });
    await testInfo.attach(`${number}_${stepName}`, { body: buffer, contentType: "image/jpeg" });

    return filePath;
}
