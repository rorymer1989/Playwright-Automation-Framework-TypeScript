import { defineConfig } from "@playwright/test";

/**
 * Config for `playwright merge-reports -c merge.config.ts`.
 * Blobs come from different machines (matrix runners and the visual job's
 * container) whose absolute testDir differ; pinning it here lets Playwright
 * merge them and keeps test file paths correct in the report.
 */
export default defineConfig({
    testDir: "./tests",
});
