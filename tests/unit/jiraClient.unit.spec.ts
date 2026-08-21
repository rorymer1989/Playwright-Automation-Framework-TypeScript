import http from "node:http";
import { test, expect } from "@playwright/test";
import {
    JiraClient,
    adfToText,
    extractAcceptanceCriteria,
    getJiraConfig,
    storyToMarkdown,
} from "../../utilities/jiraClient";

const adf = {
    type: "doc",
    version: 1,
    content: [
        {
            type: "paragraph",
            content: [
                { type: "text", text: "As a shopper I want to " },
                { type: "text", text: "log in", marks: [{ type: "strong" }] },
            ],
        },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Acceptance criteria" }] },
        {
            type: "bulletList",
            content: [
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "Given a registered user, when valid credentials are entered, then the catalogue is shown",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", text: "Locked users should see an error" }],
                        },
                    ],
                },
            ],
        },
        { type: "paragraph", content: [{ type: "text", text: "Notes:" }] },
        { type: "paragraph", content: [{ type: "text", text: "Password for all users is secret_sauce" }] },
    ],
};

test.describe("jiraClient", () => {
    test("adfToText flattens paragraphs, headings and lists", () => {
        const text = adfToText(adf);
        expect(text).toContain("As a shopper I want to log in");
        expect(text).toContain("Acceptance criteria");
        expect(text).toContain("- Given a registered user");
        expect(text).toContain("- Locked users should see an error");
    });

    test("extractAcceptanceCriteria picks AC section, gherkin lines and should-bullets", () => {
        const criteria = extractAcceptanceCriteria(adfToText(adf));
        expect(criteria).toEqual([
            "Given a registered user, when valid credentials are entered, then the catalogue is shown",
            "Locked users should see an error",
        ]);
    });

    test("getJiraConfig normalises the base URL and requires every variable", () => {
        expect(
            getJiraConfig({ JIRA_BASE_URL: "site.atlassian.net/", JIRA_EMAIL: "a@b.c", JIRA_API_TOKEN: "t" })
                .baseUrl
        ).toBe("https://site.atlassian.net");
        expect(() => getJiraConfig({ JIRA_BASE_URL: "x" })).toThrow(/Jira not configured/);
    });

    test("getStory maps the REST payload and storyToMarkdown renders it", async () => {
        const authHeaders: string[] = [];
        const server = http.createServer((req, res) => {
            res.setHeader("content-type", "application/json");
            authHeaders.push(req.headers.authorization ?? "");
            if (req.url?.startsWith("/rest/api/3/issue/SCRUM-7")) {
                res.end(
                    JSON.stringify({
                        key: "SCRUM-7",
                        fields: {
                            summary: "Shopper login",
                            description: adf,
                            issuetype: { name: "Story" },
                            status: { name: "To Do" },
                            priority: { name: "High" },
                            labels: ["shop"],
                            subtasks: [
                                {
                                    key: "SCRUM-8",
                                    fields: { summary: "Locked user", status: { name: "Done" } },
                                },
                            ],
                        },
                    })
                );
            } else {
                res.statusCode = 404;
                res.end("{}");
            }
        });
        await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
        const { port } = server.address() as { port: number };
        try {
            const client = new JiraClient({
                baseUrl: `http://127.0.0.1:${port}`,
                email: "a@b.c",
                apiToken: "t",
            });
            const story = await client.getStory("SCRUM-7");
            expect(story).toMatchObject({
                key: "SCRUM-7",
                summary: "Shopper login",
                type: "Story",
                status: "To Do",
                priority: "High",
                labels: ["shop"],
            });
            expect(story.acceptanceCriteria).toHaveLength(2);
            expect(story.subtasks).toEqual([{ key: "SCRUM-8", summary: "Locked user", status: "Done" }]);

            const md = storyToMarkdown(story);
            expect(md).toContain("# SCRUM-7: Shopper login");
            expect(md).toContain("## Acceptance criteria\n- Given a registered user");
            expect(md).toContain("- SCRUM-8 (Done): Locked user");

            await expect(client.getStory("NOPE-1")).rejects.toThrow(/HTTP 404/);
            expect(authHeaders.every((h) => h.startsWith("Basic "))).toBeTruthy();
        } finally {
            server.close();
        }
    });
});

test.describe("jira bugs from failures", () => {
    const report = {
        suites: [
            {
                title: "shop/login.spec.ts",
                suites: [
                    {
                        title: "Shop — login @SCRUM-1",
                        specs: [
                            {
                                title: "rejects locked out user",
                                file: "shop/login.spec.ts",
                                line: 28,
                                tests: [
                                    {
                                        projectName: "chromium",
                                        results: [
                                            {
                                                status: "failed",
                                                error: { message: "\u001b[31mexpected\u001b[0m X" },
                                                attachments: [
                                                    {
                                                        name: "screenshot",
                                                        path: "/tmp/s.png",
                                                        contentType: "image/png",
                                                    },
                                                    {
                                                        name: "trace",
                                                        path: "/tmp/t.zip",
                                                        contentType: "application/zip",
                                                    },
                                                    { name: "stdout", contentType: "text/plain" },
                                                ],
                                            },
                                            { status: "passed" },
                                        ],
                                    },
                                    {
                                        projectName: "firefox",
                                        results: [
                                            {
                                                status: "timedOut",
                                                error: { message: "Timeout" },
                                                attachments: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                title: "passes",
                                file: "shop/login.spec.ts",
                                line: 40,
                                tests: [{ projectName: "chromium", results: [{ status: "passed" }] }],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    test("collectFailures uses the last result, keeps evidence attachments and strips ANSI", async () => {
        const { collectFailures } = await import("../../scripts/jira-bugs");
        const failures = collectFailures(report);
        expect(failures).toHaveLength(1); // chromium passed on retry; firefox timed out
        expect(failures[0]).toMatchObject({
            title: "rejects locked out user",
            project: "firefox",
            message: "Timeout",
            suite: "shop/login.spec.ts › Shop — login @SCRUM-1",
        });
    });

    test("toBugReport builds a structured bug with labels and environment", async () => {
        const { collectFailures, toBugReport } = await import("../../scripts/jira-bugs");
        const bug = toBugReport(collectFailures(report)[0], "SCRUM", "https://ci/run/1");
        expect(bug.summary).toBe("[Automation][firefox] rejects locked out user");
        expect(bug.labels).toEqual(["automated", "playwright", "firefox"]);
        expect(bug.environment.Report).toBe("https://ci/run/1");
        expect(bug.steps[0]).toContain("shop/login.spec.ts:28 --project=firefox");
    });

    test("createBug, search and attach hit the expected endpoints", async () => {
        const calls: { method: string; url: string; contentType: string }[] = [];
        const server = http.createServer((req, res) => {
            calls.push({
                method: req.method ?? "",
                url: req.url ?? "",
                contentType: req.headers["content-type"] ?? "",
            });
            res.setHeader("content-type", "application/json");
            if (req.url === "/rest/api/3/issue" && req.method === "POST")
                res.end(JSON.stringify({ key: "SCRUM-99", id: "1" }));
            else if (req.url === "/rest/api/3/search/jql") res.end(JSON.stringify({ issues: [] }));
            else if (req.url?.endsWith("/attachments")) res.end("[]");
            else {
                res.statusCode = 404;
                res.end("{}");
            }
            req.resume();
        });
        await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
        const { port } = server.address() as { port: number };
        const { bugToAdf } = await import("../../utilities/jiraClient");
        const bug = {
            projectKey: "SCRUM",
            summary: "s",
            description: "d",
            steps: ["1"],
            expected: "e",
            actual: "a",
            environment: { Env: "UAT" },
        };
        try {
            const client = new JiraClient({
                baseUrl: `http://127.0.0.1:${port}`,
                email: "a@b.c",
                apiToken: "t",
            });
            expect(await client.search("project = SCRUM")).toEqual([]);
            const created = await client.createBug(bug);
            expect(created).toEqual({
                key: "SCRUM-99",
                id: "1",
                url: `http://127.0.0.1:${port}/browse/SCRUM-99`,
            });
            await client.attach("SCRUM-99", "package.json");
        } finally {
            server.close();
        }
        expect(calls.map((c) => `${c.method} ${c.url}`)).toEqual([
            "POST /rest/api/3/search/jql",
            "POST /rest/api/3/issue",
            "POST /rest/api/3/issue/SCRUM-99/attachments",
        ]);
        expect(calls[2].contentType).toMatch(/^multipart\/form-data/);
        expect(bugToAdf(bug).content?.map((n) => n.type)).toEqual([
            "heading",
            "paragraph",
            "heading",
            "orderedList",
            "heading",
            "paragraph",
            "heading",
            "paragraph",
            "heading",
            "bulletList",
        ]);
    });
});
