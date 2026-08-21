import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { loadEnvironment, ENV } from "./config/environment";

// Loads config/environments/<TEST_ENV>.env (default: uat)
loadEnvironment();

const isCI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: process.env.PW_WORKERS ? Number(process.env.PW_WORKERS) : (isCI ? 2 : undefined),
    timeout: 60_000,
    expect: { timeout: 10_000 },

    reporter: [
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
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },

        /* Mobile viewports */
        // { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
        // { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
    ],
});
