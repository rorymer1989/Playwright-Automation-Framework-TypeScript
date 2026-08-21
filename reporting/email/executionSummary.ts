import fs from "node:fs";
import path from "node:path";
import { EXECUTION_CONFIG } from "../../config/executionConfig";
import type { EmailSummary } from "./emailTemplate";

export function getExecutionSummary(): EmailSummary {

    const reportPath = path.join(process.cwd(), "test-result.json");

    if (!fs.existsSync(reportPath)) {
        throw new Error("test-result.json not found.");
    }

    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

    let passed = 0;
    let failed = 0;
    let skipped = 0;

    interface TestResult {
        status: "passed" | "failed" | "skipped" | string;
    }

    interface Test {
        results?: TestResult[];
    }

    interface Spec {
        tests: Test[];
    }

    interface Suite {
        specs?: Spec[];
        suites?: Suite[];
    }

    function traverseSuites(suites: Suite[] | undefined): void {

        if (!suites) return;

        for (const suite of suites) {

            if (suite.specs) {

                for (const spec of suite.specs) {

                    for (const test of spec.tests) {

                        const result = test.results?.[0];

                        if (!result) continue;

                        switch (result.status) {

                            case "passed":
                                passed++;
                                break;

                            case "failed":
                                failed++;
                                break;

                            case "skipped":
                                skipped++;
                                break;
                        }

                    }

                }

            }

            if (suite.suites) {
                traverseSuites(suite.suites);
            }

        }

    }

    traverseSuites(report.suites);

    return {

        framework: EXECUTION_CONFIG.frameworkName,

        frameworkVersion: EXECUTION_CONFIG.frameworkVersion,

        environment: process.env.TEST_ENV?.toUpperCase() || "UAT",

        browser: EXECUTION_CONFIG.browser,

        executionMode: EXECUTION_CONFIG.executionType,

        total: passed + failed + skipped,

        passed,

        failed,

        skipped,

        duration: report.stats?.duration
            ? `${Math.round(report.stats.duration / 1000)} Seconds`
            : "N/A"

    };

}

