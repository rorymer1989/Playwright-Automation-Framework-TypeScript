import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { evaluateFlakyPolicy, formatFlakyMarkdown, getFlakyTests } from "../../reporting/flaky/flakyReport";

function writeReport(report: unknown): string {
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "flaky-")), "test-result.json");
    fs.writeFileSync(file, JSON.stringify(report));
    return file;
}

const spec = (title: string, line: number, tests: object[]) => ({
    title,
    file: "tests/x.spec.ts",
    line,
    tests,
});
const attempts = (project: string, ...statuses: string[]) => ({
    projectName: project,
    results: statuses.map((status) => ({ status })),
});

test.describe("flakyReport", () => {
    test("detects tests that passed only after a failed attempt, across nested suites and projects", () => {
        const file = writeReport({
            suites: [
                {
                    title: "root",
                    specs: [
                        spec("stable", 10, [attempts("chromium", "passed")]),
                        spec("flaky by attempts", 20, [attempts("firefox", "failed", "passed")]),
                        spec("timed out then passed", 30, [attempts("webkit", "timedOut", "passed")]),
                        spec("really failed", 40, [attempts("chromium", "failed", "failed", "failed")]),
                    ],
                    suites: [
                        {
                            title: "nested",
                            specs: [
                                spec("flagged by playwright", 5, [
                                    { projectName: "api", status: "flaky", results: [] },
                                ]),
                            ],
                        },
                    ],
                },
            ],
        });

        expect(getFlakyTests(file)).toEqual([
            {
                title: "flagged by playwright",
                file: "tests/x.spec.ts",
                line: 5,
                project: "api",
                attempts: [],
            },
            {
                title: "flaky by attempts",
                file: "tests/x.spec.ts",
                line: 20,
                project: "firefox",
                attempts: ["failed", "passed"],
            },
            {
                title: "timed out then passed",
                file: "tests/x.spec.ts",
                line: 30,
                project: "webkit",
                attempts: ["timedOut", "passed"],
            },
        ]);
    });

    test("policy: budget defaults to 0 and invalid values fall back to 0", () => {
        const file = writeReport({
            suites: [{ title: "r", specs: [spec("f", 1, [attempts("chromium", "failed", "passed")])] }],
        });

        expect(evaluateFlakyPolicy(file, undefined)).toMatchObject({ budget: 0, exceeded: true });
        expect(evaluateFlakyPolicy(file, "1")).toMatchObject({ budget: 1, exceeded: false });
        expect(evaluateFlakyPolicy(file, "nope")).toMatchObject({ budget: 0, exceeded: true });
        expect(evaluateFlakyPolicy(file, "-3")).toMatchObject({ budget: 0, exceeded: true });
    });

    test("markdown lists every flaky test and states the verdict", () => {
        const md = formatFlakyMarkdown({
            budget: 0,
            exceeded: true,
            flaky: [
                {
                    title: "t",
                    file: "tests/x.spec.ts",
                    line: 7,
                    project: "webkit",
                    attempts: ["failed", "passed"],
                },
            ],
        });
        expect(md).toContain("❌ Flaky policy: 1 flaky test(s), budget 0");
        expect(md).toContain("| `tests/x.spec.ts:7` | t | webkit | failed → passed |");

        expect(formatFlakyMarkdown({ budget: 0, exceeded: false, flaky: [] })).toContain(
            "✅ Flaky policy: 0 flaky test(s)"
        );
    });

    test("throws a clear error when the report is missing", () => {
        expect(() => getFlakyTests("/nowhere/test-result.json")).toThrow(/not found/);
    });
});
