import pkg from "../package.json";

export const EXECUTION_CONFIG = {
    frameworkName: "Playwright Automation Framework",
    frameworkVersion: `v${pkg.version}`,
    executionType: "Parallel",
    company: "Open Source",
    browser: process.env.BROWSER ?? "chromium",
    author: "Priyanshu Pathak",
} as const;
