export interface EmailConfig {
    service: string;
    from: string;
    password: string;
    to: string;
    /**
     * Attach the zipped HTML/Allure reports. Gmail blocks archives that contain
     * .js files (which every HTML report does), so the default is "auto":
     * attach unless the service is gmail. Force with EMAIL_ATTACH_REPORTS=true|false.
     */
    attachReports: boolean;
    /** Public URL of the hosted report (CI artifacts, Allure server…), linked in the body. */
    reportUrl: string;
}

/**
 * Read lazily so that `loadEnvironment()` (which runs after module imports)
 * has already populated process.env from .env.
 */
export function getEmailConfig(): EmailConfig {
    const service = process.env.EMAIL_SERVICE ?? "gmail";
    const attachFlag = process.env.EMAIL_ATTACH_REPORTS;
    return {
        service,
        from: process.env.EMAIL_FROM ?? "",
        password: process.env.EMAIL_PASSWORD ?? "",
        to: process.env.EMAIL_TO ?? "",
        attachReports: attachFlag !== undefined ? attachFlag === "true" : service !== "gmail",
        reportUrl: process.env.REPORT_URL ?? "",
    };
}

export function isEmailConfigured(): boolean {
    const { from, password, to } = getEmailConfig();
    return Boolean(from && password && to);
}
