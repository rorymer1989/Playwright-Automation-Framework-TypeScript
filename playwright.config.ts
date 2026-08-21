import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { loadEnvironment, ENV, storageStatePath } from "./config/environment";

// Loads config/environments/<TEST_ENV>.env (default: uat)
loadEnvironment();

const isCI = !!process.env.CI;

const BROWSERS = [
    { name: "chromium", device: "Desktop Chrome" },
    { name: "firefox", device: "Desktop Firefox" },
    { name: "webkit", device: "Desktop Safari" },
] as const;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: process.env.PW_WORKERS ? Number(process.env.PW_WORKERS) : isCI ? 2 : undefined,
    timeout: 60_000,
    expect: {
        timeout: 10_000,
        toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide" },
    },
    // Baseline name: <name>-<project>-<platform>.png → one baseline per browser and OS
    snapshotPathTemplate:
        "{testDir}/{testFileDir}/__snapshots__/{testFileName}/{arg}-{projectName}-{platform}{ext}",

    // CI shards emit a blob each; the merge-reports job turns them into one HTML report.
    reporter: isCI
        ? [
              ["list"],
              ["blob", { outputDir: "blob-report" }],
              ["json", { outputFile: "test-result.json" }],
              ["allure-playwright", { resultsDir: "allure-results" }],
          ]
        : [
              ["list"],
              ["html", { outputFolder: "playwright-report", open: "never" }],
              ["json", { outputFile: "test-result.json" }],
              ["allure-playwright", { resultsDir: "allure-results" }],
          ],

    globalSetup: path.join(__dirname, "global-setup.ts"),
    globalTeardown: path.join(__dirname, "global-teardown.ts"),

    use: {
        baseURL: ENV.baseUrl,
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },

    projects: [
        // Each browser gets its own `setup:<browser>` project that logs in once
        // (tests/auth.setup.ts) with the SAME device profile and stores the state the
        // browser project then reuses. See storageStatePath() for why it is per browser.
        ...BROWSERS.flatMap(({ name, device }) => [
            {
                name: `setup:${name}`,
                testMatch: /auth\.setup\.ts/,
                use: { ...devices[device] },
            },
            {
                name,
                testIgnore: /.*\.(api|unit)\.spec\.ts/,
                dependencies: [`setup:${name}`],
                use: { ...devices[device], storageState: storageStatePath(name) },
            },
        ]),

        // Unit tests of framework utilities: no browser, no network
        { name: "unit", testMatch: /.*\.unit\.spec\.ts/ },

        // API tests: no browser, baseURL points at the API
        {
            name: "api",
            testMatch: /.*\.api\.spec\.ts/,
            use: { baseURL: ENV.apiUrl },
        },
    ],
});
