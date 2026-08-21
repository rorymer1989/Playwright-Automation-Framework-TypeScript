import fs from "node:fs";
import path from "node:path";

/** Minimal shape of Playwright's JSON reporter output that we rely on. */
interface JsonReport {
    suites?: JsonSuite[];
}
interface JsonSuite {
    title: string;
    file?: string;
    specs?: JsonSpec[];
    suites?: JsonSuite[];
}
interface JsonSpec {
    title: string;
    file: string;
    line: number;
    tests: JsonTest[];
}
interface JsonTest {
    projectName?: string;
    /** "expected" | "unexpected" | "flaky" | "skipped" (Playwright's verdict across retries). */
    status?: string;
    results?: { status: string }[];
}

export interface FlakyTest {
    title: string;
    file: string;
    line: number;
    project: string;
    /** Per-attempt statuses, oldest first (e.g. ["failed", "passed"]). */
    attempts: string[];
}

export interface FlakyPolicyResult {
    flaky: FlakyTest[];
    budget: number;
    /** true when the number of flaky tests exceeds the budget. */
    exceeded: boolean;
}

const FAILED = new Set(["failed", "timedOut", "interrupted"]);

/**
 * A test is flaky when it passed only after at least one failed attempt.
 * Playwright already stamps `status: "flaky"` on the test; the attempt-based check is the
 * fallback for reports produced by older reporters or merged without that field.
 */
function isFlaky(test: JsonTest): boolean {
    if (test.status === "flaky") return true;
    const attempts = test.results ?? [];
    return (
        attempts.length > 1 &&
        attempts.at(-1)?.status === "passed" &&
        attempts.some((r) => FAILED.has(r.status))
    );
}

export function getFlakyTests(reportPath = path.join(process.cwd(), "test-result.json")): FlakyTest[] {
    if (!fs.existsSync(reportPath)) {
        throw new Error(`${reportPath} not found. Run the tests first.`);
    }
    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8")) as JsonReport;
    const flaky: FlakyTest[] = [];

    const visit = (suites: JsonSuite[] | undefined): void => {
        for (const suite of suites ?? []) {
            for (const spec of suite.specs ?? []) {
                for (const test of spec.tests) {
                    if (!isFlaky(test)) continue;
                    flaky.push({
                        title: spec.title,
                        file: spec.file,
                        line: spec.line,
                        project: test.projectName ?? "",
                        attempts: (test.results ?? []).map((r) => r.status),
                    });
                }
            }
            visit(suite.suites);
        }
    };
    visit(report.suites);

    return flaky.sort(
        (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.project.localeCompare(b.project)
    );
}

/** Reads FLAKY_BUDGET (default 0 = zero tolerance) and compares it with the flaky tests found. */
export function evaluateFlakyPolicy(
    reportPath?: string,
    budgetEnv = process.env.FLAKY_BUDGET
): FlakyPolicyResult {
    const parsed = Number(budgetEnv ?? 0);
    const budget = Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
    const flaky = getFlakyTests(reportPath);
    return { flaky, budget, exceeded: flaky.length > budget };
}

/** Markdown table, also used for the GitHub job summary. */
export function formatFlakyMarkdown({ flaky, budget, exceeded }: FlakyPolicyResult): string {
    const header = exceeded
        ? `### ❌ Flaky policy: ${flaky.length} flaky test(s), budget ${budget}`
        : `### ✅ Flaky policy: ${flaky.length} flaky test(s), budget ${budget}`;
    if (flaky.length === 0) return `${header}\n\nNo test needed a retry to pass.\n`;

    const rows = flaky.map(
        (f) => `| \`${f.file}:${f.line}\` | ${f.title} | ${f.project} | ${f.attempts.join(" → ")} |`
    );
    return [
        header,
        "",
        "| Test | Title | Project | Attempts |",
        "| --- | --- | --- | --- |",
        ...rows,
        "",
        "A flaky test passed only after a retry: it hides a real defect or a non-deterministic step. Fix it or quarantine it with a linked issue — do not raise the budget.",
        "",
    ].join("\n");
}
