import nodemailer from "nodemailer";
import { getExecutionSummary } from "./executionSummary";
import { generateEmailTemplate } from "./emailTemplate";
import { emailConfig, isEmailConfigured } from "./emailConfig";
import { zipExecutionReports } from "../zip/zipReport";

/**
 * Sends the execution summary email with the zipped HTML/Allure reports attached.
 * Requires EMAIL_FROM, EMAIL_PASSWORD and EMAIL_TO (see .env.example).
 */
export async function sendExecutionReport(): Promise<void> {
    if (!isEmailConfigured()) {
        throw new Error("Email not configured: set EMAIL_FROM, EMAIL_PASSWORD and EMAIL_TO.");
    }

    const summary = getExecutionSummary();
    const attachments = await zipExecutionReports();

    const transporter = nodemailer.createTransport({
        service: emailConfig.service,
        auth: { user: emailConfig.from, pass: emailConfig.password },
    });

    await transporter.sendMail({
        from: emailConfig.from,
        to: emailConfig.to,
        subject: `Playwright Execution Report | ${summary.environment} | ${summary.passed}/${summary.total} passed`,
        html: generateEmailTemplate(summary),
        attachments,
    });

    console.log("\n========================================");
    console.log(`✅ Execution email sent to ${emailConfig.to}`);
    console.log("========================================");
}
