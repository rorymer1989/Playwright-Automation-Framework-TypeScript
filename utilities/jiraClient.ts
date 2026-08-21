/**
 * Minimal Jira Cloud REST v3 client used to pull user stories into the
 * test-generation workflow. Credentials come from .env / CI secrets:
 *   JIRA_BASE_URL   https://<site>.atlassian.net  (scheme optional)
 *   JIRA_EMAIL      Atlassian account email
 *   JIRA_API_TOKEN  https://id.atlassian.com/manage-profile/security/api-tokens
 */

import fs from "node:fs";
import path from "node:path";

export interface JiraConfig {
    baseUrl: string;
    email: string;
    apiToken: string;
}

export interface JiraStory {
    key: string;
    url: string;
    summary: string;
    type: string;
    status: string;
    priority?: string;
    labels: string[];
    /** Description rendered as plain text (ADF → text). */
    description: string;
    /** Lines that look like acceptance criteria (Given/When/Then, "AC:", checklist items). */
    acceptanceCriteria: string[];
    subtasks: { key: string; summary: string; status: string }[];
}

export function getJiraConfig(env: NodeJS.ProcessEnv = process.env): JiraConfig {
    const raw = env.JIRA_BASE_URL ?? "";
    const baseUrl = (raw.startsWith("http") ? raw : `https://${raw}`).replace(/\/+$/, "");
    const email = env.JIRA_EMAIL ?? "";
    const apiToken = env.JIRA_API_TOKEN ?? "";
    if (!raw || !email || !apiToken) {
        throw new Error(
            "Jira not configured: set JIRA_BASE_URL, JIRA_EMAIL and JIRA_API_TOKEN (see .env.example)."
        );
    }
    return { baseUrl, email, apiToken };
}

/* ---- Atlassian Document Format → plain text --------------------------- */

interface AdfNode {
    type: string;
    text?: string;
    content?: AdfNode[];
    attrs?: Record<string, unknown>;
}

const BLOCK_TYPES = new Set([
    "paragraph",
    "heading",
    "listItem",
    "codeBlock",
    "blockquote",
    "tableRow",
    "rule",
]);

export function adfToText(node: AdfNode | string | null | undefined): string {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (node.type === "text") return node.text ?? "";
    if (node.type === "hardBreak") return "\n";
    if (node.type === "mention") return typeof node.attrs?.text === "string" ? node.attrs.text : "";

    const inner = (node.content ?? []).map(adfToText);
    if (node.type === "bulletList" || node.type === "orderedList") {
        return (
            inner
                .map((item, i) => `${node.type === "orderedList" ? `${i + 1}.` : "-"} ${item.trim()}`)
                .join("\n") + "\n"
        );
    }
    if (node.type === "listItem") return inner.join("").trim();
    if (node.type === "tableCell" || node.type === "tableHeader") return inner.join("").trim() + " | ";
    const joined = inner.join("");
    return BLOCK_TYPES.has(node.type) ? `${joined.trim()}\n` : joined;
}

export function extractAcceptanceCriteria(text: string): string[] {
    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    const criteria: string[] = [];
    let inSection = false;
    for (const line of lines) {
        if (/^(acceptance criteria|criterios? de aceptaci[oó]n|ac)\s*:?$/i.test(line)) {
            inSection = true;
            continue;
        }
        if (inSection && /^[A-Za-z].{0,40}:$/.test(line)) inSection = false; // next section header
        const gherkin = /^(given|when|then|and|dado|cuando|entonces|y)\b/i.test(line);
        const bullet = /^(-|\*|\d+\.|\[[ x]\])\s+/i.test(line);
        if (inSection || gherkin || (bullet && /\b(should|must|debe|debería|can|puede)\b/i.test(line))) {
            criteria.push(line.replace(/^(-|\*|\d+\.|\[[ x]\])\s+/, ""));
        }
    }
    return criteria;
}

/* ---- API ------------------------------------------------------------- */

interface JiraIssueResponse {
    key: string;
    fields: {
        summary: string;
        description?: AdfNode | null;
        issuetype?: { name: string };
        status?: { name: string };
        priority?: { name: string };
        labels?: string[];
        subtasks?: { key: string; fields: { summary: string; status?: { name: string } } }[];
    };
}

export class JiraClient {
    constructor(private readonly config: JiraConfig = getJiraConfig()) {}

    private get headers(): Record<string, string> {
        const token = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString("base64");
        return {
            Authorization: `Basic ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        };
    }

    async request<T>(apiPath: string, init: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            ...this.headers,
            ...((init.headers as Record<string, string> | undefined) ?? {}),
        };
        // An empty value removes a default header (multipart bodies must let fetch set Content-Type)
        for (const [k, v] of Object.entries(headers)) if (v === "") delete headers[k];
        const response = await fetch(`${this.config.baseUrl}/rest/api/3${apiPath}`, { ...init, headers });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(
                `Jira ${init.method ?? "GET"} ${apiPath} → HTTP ${response.status}: ${body.slice(0, 300)}`
            );
        }
        return (response.status === 204 ? undefined : await response.json()) as T;
    }

    async getStory(key: string): Promise<JiraStory> {
        const issue = await this.request<JiraIssueResponse>(
            `/issue/${encodeURIComponent(key)}?fields=summary,description,issuetype,status,priority,labels,subtasks`
        );
        const description = adfToText(issue.fields.description).trim();
        return {
            key: issue.key,
            url: `${this.config.baseUrl}/browse/${issue.key}`,
            summary: issue.fields.summary,
            type: issue.fields.issuetype?.name ?? "Unknown",
            status: issue.fields.status?.name ?? "Unknown",
            priority: issue.fields.priority?.name,
            labels: issue.fields.labels ?? [],
            description,
            acceptanceCriteria: extractAcceptanceCriteria(description),
            subtasks: (issue.fields.subtasks ?? []).map((s) => ({
                key: s.key,
                summary: s.fields.summary,
                status: s.fields.status?.name ?? "Unknown",
            })),
        };
    }

    /** Searches issues with JQL; returns keys + summaries (used to de-duplicate bugs). */
    async search(jql: string, maxResults = 20): Promise<{ key: string; summary: string; status: string }[]> {
        const result = await this.request<{
            issues: { key: string; fields: { summary: string; status?: { name: string } } }[];
        }>("/search/jql", {
            method: "POST",
            body: JSON.stringify({ jql, maxResults, fields: ["summary", "status"] }),
        });
        return result.issues.map((i) => ({
            key: i.key,
            summary: i.fields.summary,
            status: i.fields.status?.name ?? "Unknown",
        }));
    }

    /** Creates a Bug with a structured ADF description. */
    async createBug(bug: BugReport): Promise<CreatedIssue> {
        const adf = bugToAdf(bug);
        const body = {
            fields: {
                project: { key: bug.projectKey },
                summary: bug.summary,
                issuetype: { name: bug.issueType ?? "Bug" },
                ...(bug.priority ? { priority: { name: bug.priority } } : {}),
                labels: bug.labels ?? [],
                description: { type: "doc", version: 1, content: adf.content },
            },
        };
        const created = await this.request<{ key: string; id: string }>("/issue", {
            method: "POST",
            body: JSON.stringify(body),
        });
        return { key: created.key, id: created.id, url: `${this.config.baseUrl}/browse/${created.key}` };
    }

    /** Uploads a file as an attachment (screenshots, traces, reports). */
    async attach(key: string, filePath: string, fileName: string = path.basename(filePath)): Promise<void> {
        const form = new FormData();
        form.append("file", new Blob([fs.readFileSync(filePath)]), fileName);
        await this.request(`/issue/${encodeURIComponent(key)}/attachments`, {
            method: "POST",
            body: form,
            headers: { "X-Atlassian-Token": "no-check", "Content-Type": "" },
        });
    }

    /** Adds a plain-text comment to an issue (e.g. link to the generated tests / PR). */
    async addComment(key: string, text: string): Promise<void> {
        const body = {
            body: {
                type: "doc",
                version: 1,
                content: [{ type: "paragraph", content: [{ type: "text", text }] }],
            },
        };
        await this.request(`/issue/${encodeURIComponent(key)}/comment`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
}

/* ---- Bug creation ------------------------------------------------------ */

export interface BugReport {
    projectKey: string;
    summary: string;
    /** One paragraph: what is wrong. */
    description: string;
    steps: string[];
    expected: string;
    actual: string;
    environment: Record<string, string>;
    labels?: string[];
    priority?: string;
    /** Issue type name (default "Bug"). */
    issueType?: string;
}

export interface CreatedIssue {
    key: string;
    id: string;
    url: string;
}

const text = (t: string): AdfNode => ({ type: "text", text: t });
const paragraph = (t: string): AdfNode => ({ type: "paragraph", content: [text(t)] });
const heading = (t: string, level = 3): AdfNode => ({
    type: "heading",
    attrs: { level },
    content: [text(t)],
});
const list = (items: string[], ordered = false): AdfNode => ({
    type: ordered ? "orderedList" : "bulletList",
    content: items.map((i) => ({ type: "listItem", content: [paragraph(i)] })),
});

/** Builds the ADF body used for bugs raised from test failures. */
export function bugToAdf(bug: BugReport): AdfNode {
    return {
        type: "doc",
        attrs: { version: 1 },
        content: [
            heading("Summary", 2),
            paragraph(bug.description),
            heading("Steps to reproduce"),
            list(bug.steps, true),
            heading("Expected result"),
            paragraph(bug.expected),
            heading("Actual result"),
            paragraph(bug.actual),
            heading("Environment"),
            list(Object.entries(bug.environment).map(([k, v]) => `${k}: ${v}`)),
        ],
    };
}

/** Markdown rendering used as the input of the test-generation prompt. */
export function storyToMarkdown(story: JiraStory): string {
    const ac = story.acceptanceCriteria.length
        ? story.acceptanceCriteria.map((c) => `- ${c}`).join("\n")
        : "_(none detected — derive them from the description)_";
    const subtasks = story.subtasks.length
        ? story.subtasks.map((s) => `- ${s.key} (${s.status}): ${s.summary}`).join("\n")
        : "_(none)_";
    return [
        `# ${story.key}: ${story.summary}`,
        `${story.url}`,
        `Type: ${story.type} · Status: ${story.status}${story.priority ? ` · Priority: ${story.priority}` : ""}${story.labels.length ? ` · Labels: ${story.labels.join(", ")}` : ""}`,
        "",
        "## Description",
        story.description || "_(empty)_",
        "",
        "## Acceptance criteria",
        ac,
        "",
        "## Subtasks",
        subtasks,
    ].join("\n");
}
