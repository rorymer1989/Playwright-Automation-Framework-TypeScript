import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { getExecutionSummary } from "../../reporting/email/executionSummary";

const result = (...statuses: string[]) => ({ results: statuses.map((status) => ({ status })) });

function writeReport(report: unknown): string {
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "report-")), "test-result.json");
    fs.writeFileSync(file, JSON.stringify(report));
    return file;
}

test.describe("executionSummary", () => {
    test("counts passed / failed / skipped across nested suites", () => {
        const file = writeReport({
            stats: { duration: 12_600 },
            suites: [
                {
                    specs: [{ tests: [result("passed")] }, { tests: [result("failed")] }],
                    suites: [{ specs: [{ tests: [result("skipped"), result("passed")] }] }],
                },
            ],
        });

        const summary = getExecutionSummary(file);
        expect(summary).toMatchObject({ total: 4, passed: 2, failed: 1, skipped: 1, duration: "13 Seconds" });
    });

    test("uses the LAST result of a test (retries) and treats timedOut as failed", () => {
        const file = writeReport({
            suites: [
                {
                    specs: [
                        { tests: [result("failed", "passed")] }, // flaky → passed on retry
                        { tests: [result("timedOut")] },
                        { tests: [result("passed", "interrupted")] },
                    ],
                },
            ],
        });

        expect(getExecutionSummary(file)).toMatchObject({ total: 3, passed: 1, failed: 2, skipped: 0 });
    });

    test("reports N/A duration when stats are missing", () => {
        expect(getExecutionSummary(writeReport({ suites: [] })).duration).toBe("N/A");
    });

    test("throws when the report file does not exist", () => {
        expect(() => getExecutionSummary("/nonexistent/test-result.json")).toThrow(/not found/);
    });
});
