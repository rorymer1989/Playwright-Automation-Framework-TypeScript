import { logger } from "../../utilities/logger";
import nodemailer from "nodemailer";
import { getExecutionSummary } from "./executionSummary";
import { generateEmailTemplate } from "./emailTemplate";
import { getEmailConfig, isEmailConfigured } from "./emailConfig";
import fs from "node:fs";
import path from "node:path";
import { zipExecutionReports, type ReportArchive } from "../zip/zipReport";

/** Gmail rejects messages over 25 MB; keep a margin for encoding overhead. */
const MAX_ATTACHMENT_MB = Number(process.env.EMAIL_MAX_ATTACHMENT_MB ?? 18);

function selectAttachments(archives: ReportArchive[]): {
    attachments: ReportArchive[];
    skipped: ReportArchive[];
} {
    const limit = MAX_ATTACHMENT_MB * 1024 * 1024;
    let budget = limit;
    const attachments: ReportArchive[] = [];
    const skipped: ReportArchive[] = [];
    for (const archive of archives) {
        const size = fs.statSync(archive.path).size;
        if (size <= budget) {
            attachments.push(archive);
            budget -= size;
        } else {
            skipped.push(archive);
        }
    }
    return { attachments, skipped };
}

/**
 * Sends the execution summary email with the zipped HTML/Allure reports attached.
 * Requires EMAIL_FROM, EMAIL_PASSWORD and EMAIL_TO (see .env.example).
 */
export async function sendExecutionReport(): Promise<void> {
    if (!isEmailConfigured()) {
        throw new Error("Email not configured: set EMAIL_FROM, EMAIL_PASSWORD and EMAIL_TO.");
    }

    const emailConfig = getEmailConfig();
    const summary = getExecutionSummary();
    // The JSON summary is always safe to attach; zipped HTML reports only where the provider allows it.
    const archives: ReportArchive[] = [
        { filename: "test-result.json", path: path.join(process.cwd(), "test-result.json") },
    ];
    if (emailConfig.attachReports) {
        archives.push(...(await zipExecutionReports()));
    } else {
        logger.info(
            "Report archives not attached (Gmail blocks archives containing .js). Set REPORT_URL to link the hosted report."
        );
    }
    const { attachments, skipped } = selectAttachments(archives);
    if (skipped.length) {
        logger.warn(
            `Not attached (over ${MAX_ATTACHMENT_MB} MB): ${skipped.map((a) => a.filename).join(", ")}`
        );
    }

    const transporter = nodemailer.createTransport({
        service: emailConfig.service,
        auth: { user: emailConfig.from, pass: emailConfig.password },
    });

    await transporter.sendMail({
        from: emailConfig.from,
        to: emailConfig.to,
        subject: `Playwright Execution Report | ${summary.environment} | ${summary.passed}/${summary.total} passed`,
        html: generateEmailTemplate(summary, {
            attachments: attachments.map((a) => a.filename),
            skippedAttachments: skipped.map((a) => a.filename),
            reportUrl: emailConfig.reportUrl,
        }),
        attachments,
    });

    logger.section(`✅ Execution email sent to ${emailConfig.to}`);
}
