import { test, expect } from "@playwright/test";
import { generateEmailTemplate } from "../../reporting/email/emailTemplate";

const summary = {
    framework: "F",
    frameworkVersion: "v1",
    environment: "UAT",
    browser: "chromium",
    executionMode: "Parallel",
    total: 3,
    passed: 2,
    failed: 1,
    skipped: 0,
    duration: "10 Seconds",
};

test.describe("email template", () => {
    test("lists the real attachments", () => {
        const html = generateEmailTemplate(summary, { attachments: ["PlaywrightReport.zip"] });
        expect(html).toContain("PlaywrightReport.zip");
        expect(html).not.toContain("Videos");
    });

    test("mentions archives skipped for size", () => {
        const html = generateEmailTemplate(summary, {
            attachments: [],
            skippedAttachments: ["AllureReport.zip"],
        });
        expect(html).toContain("Not attached (size limit): AllureReport.zip");
        expect(html).toContain("No attachments.");
    });
});

test.describe("email config", () => {
    const saved = { ...process.env };

    test.afterEach(() => {
        process.env = { ...saved };
    });

    test("gmail does not attach report archives by default; other services do", async () => {
        const { getEmailConfig } = await import("../../reporting/email/emailConfig");
        delete process.env.EMAIL_ATTACH_REPORTS;
        process.env.EMAIL_SERVICE = "gmail";
        expect(getEmailConfig().attachReports).toBe(false);
        process.env.EMAIL_SERVICE = "Outlook365";
        expect(getEmailConfig().attachReports).toBe(true);
        process.env.EMAIL_ATTACH_REPORTS = "true";
        process.env.EMAIL_SERVICE = "gmail";
        expect(getEmailConfig().attachReports).toBe(true);
    });

    test("template links the hosted report when REPORT_URL is set", () => {
        const html = generateEmailTemplate(summary, { reportUrl: "https://ci.example.com/run/1" });
        expect(html).toContain('href="https://ci.example.com/run/1"');
    });
});
