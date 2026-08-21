/**
 * Raises one Jira Bug per failed test in test-result.json (last result per test),
 * attaching the failure screenshot and trace when present. De-duplicates by
 * looking for an open issue with the same summary and the "automated" label.
 *
 *   npm run jira:bugs                 # create bugs
 *   npm run jira:bugs -- --dry-run    # print what would be created
 * Env: JIRA_PROJECT_KEY (default SCRUM), REPORT_URL (linked in the bug), TEST_ENV.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvironment } from "../config/environment";
import { EXECUTION_CONFIG } from "../config/executionConfig";
import { JiraClient, type BugReport } from "../utilities/jiraClient";
import { logger } from "../utilities/logger";

loadEnvironment();

interface JsonAttachment {
    name: string;
    path?: string;
    contentType: string;
}
interface JsonResult {
    status: string;
    error?: { message?: string };
    attachments?: JsonAttachment[];
}
interface JsonTest {
    projectName: string;
    results: JsonResult[];
}
interface JsonSpec {
    title: string;
    file: string;
    line: number;
    tests: JsonTest[];
}
interface JsonSuite {
    title: string;
    specs?: JsonSpec[];
    suites?: JsonSuite[];
}
interface JsonReport {
    suites?: JsonSuite[];
}

export interface Failure {
    title: string;
    suite: string;
    file: string;
    line: number;
    project: string;
    message: string;
    attachments: { name: string; path: string }[];
}

// eslint-disable-next-line no-control-regex -- ANSI escape sequences from Playwright error output
const ANSI = /\u001b\[[0-9;]*m/g;
const stripAnsi = (s: string): string => s.replace(ANSI, "");

export function collectFailures(report: JsonReport): Failure[] {
    const failures: Failure[] = [];
    const walk = (suite: JsonSuite, trail: string[]): void => {
        for (const spec of suite.specs ?? []) {
            for (const test of spec.tests) {
                const last = test.results.at(-1);
                if (!last || !["failed", "timedOut", "interrupted"].includes(last.status)) continue;
                failures.push({
                    title: spec.title,
                    suite: trail.filter(Boolean).join(" › "),
                    file: spec.file,
                    line: spec.line,
                    project: test.projectName,
                    message: stripAnsi(last.error?.message ?? last.status)
                        .split("\n")
                        .slice(0, 12)
                        .join("\n"),
                    attachments: (last.attachments ?? [])
                        .filter((a) => a.path && /screenshot|trace|video|diff|actual/.test(a.name))
                        .map((a) => ({ name: a.name, path: a.path as string })),
                });
            }
        }
        for (const child of suite.suites ?? []) walk(child, [...trail, child.title]);
    };
    for (const s of report.suites ?? []) walk(s, [s.title]);
    return failures;
}

export function toBugReport(f: Failure, projectKey: string, reportUrl?: string): BugReport {
    const env = (process.env.TEST_ENV ?? "uat").toUpperCase();
    return {
        projectKey,
        summary: `[Automation][${f.project}] ${f.title}`.slice(0, 250),
        description: `Automated test "${f.title}" failed on ${f.project} (${env}).`,
        steps: [`Run: npx playwright test ${f.file}:${f.line} --project=${f.project}`, `Suite: ${f.suite}`],
        expected: "Test passes.",
        actual: f.message,
        environment: {
            Environment: env,
            Browser: f.project,
            Framework: `${EXECUTION_CONFIG.frameworkName} ${EXECUTION_CONFIG.frameworkVersion}`,
            ...(reportUrl ? { Report: reportUrl } : {}),
            Timestamp: new Date().toISOString(),
        },
        labels: ["automated", "playwright", f.project],
        priority: "High",
    };
}

async function main(): Promise<void> {
    const dryRun = process.argv.includes("--dry-run");
    const projectKey = process.env.JIRA_PROJECT_KEY ?? "SCRUM";
    const reportPath = path.join(process.cwd(), "test-result.json");
    if (!fs.existsSync(reportPath)) throw new Error(`${reportPath} not found. Run the tests first.`);

    const failures = collectFailures(JSON.parse(fs.readFileSync(reportPath, "utf8")) as JsonReport);
    logger.info(`${failures.length} failed test(s) in test-result.json`);
    if (!failures.length) return;

    const jira = dryRun ? null : new JiraClient();
    for (const f of failures) {
        const bug = toBugReport(f, projectKey, process.env.REPORT_URL);
        if (dryRun) {
            logger.info(
                `[dry-run] ${bug.summary}\n   attachments: ${f.attachments.map((a) => a.name).join(", ") || "none"}`
            );
            continue;
        }
        const jql = `project = ${projectKey} AND labels = automated AND statusCategory != Done AND summary ~ "\\"${bug.summary.replace(/"/g, "")}\\""`;
        const existing = (await jira!.search(jql, 1))[0];
        if (existing) {
            await jira!.addComment(
                existing.key,
                `Still failing on ${new Date().toISOString()} (${f.project}).\n${f.message}`
            );
            logger.info(`↻ ${existing.key} already open → commented`);
            continue;
        }
        const created = await jira!.createBug(bug);
        for (const a of f.attachments) {
            if (fs.existsSync(a.path)) await jira!.attach(created.key, a.path);
        }
        logger.info(`🐛 ${created.key} created: ${created.url} (${f.attachments.length} attachment(s))`);
    }
}

if (require.main === module) {
    main().catch((error: unknown) => {
        logger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    });
}
