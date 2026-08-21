import fs from "node:fs";
import path from "node:path";
import { EXECUTION_CONFIG } from "../../config/executionConfig";
import type { EmailSummary } from "./emailTemplate";

/** Minimal shape of Playwright's JSON reporter output that we rely on. */
interface JsonReport {
    stats?: { duration?: number };
    suites?: JsonSuite[];
}
interface JsonSuite {
    specs?: { tests: { results?: { status: string }[] }[] }[];
    suites?: JsonSuite[];
}

export function getExecutionSummary(reportPath = path.join(process.cwd(), "test-result.json")): EmailSummary {
    if (!fs.existsSync(reportPath)) {
        throw new Error(`${reportPath} not found. Run the tests first.`);
    }

    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as JsonReport;

    const counts = { passed: 0, failed: 0, skipped: 0 };

    const visit = (suites: JsonSuite[] | undefined): void => {
        for (const suite of suites ?? []) {
            for (const spec of suite.specs ?? []) {
                for (const test of spec.tests) {
                    // Last result wins (accounts for retries)
                    const status = test.results?.at(-1)?.status;
                    if (status === "passed" || status === "failed" || status === "skipped") {
                        counts[status]++;
                    } else if (status === "timedOut" || status === "interrupted") {
                        counts.failed++;
                    }
                }
            }
            visit(suite.suites);
        }
    };
    visit(report.suites);

    return {
        framework: EXECUTION_CONFIG.frameworkName,
        frameworkVersion: EXECUTION_CONFIG.frameworkVersion,
        environment: (process.env.TEST_ENV ?? "uat").toUpperCase(),
        browser: EXECUTION_CONFIG.browser,
        executionMode: EXECUTION_CONFIG.executionType,
        total: counts.passed + counts.failed + counts.skipped,
        ...counts,
        duration: report.stats?.duration ? `${Math.round(report.stats.duration / 1000)} Seconds` : "N/A",
    };
}
