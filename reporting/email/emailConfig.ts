export interface EmailConfig {
    service: string;
    from: string;
    password: string;
    to: string;
}

/**
 * Read lazily so that `loadEnvironment()` (which runs after module imports)
 * has already populated process.env from .env.
 */
export function getEmailConfig(): EmailConfig {
    return {
        service: process.env.EMAIL_SERVICE ?? "gmail",
        from: process.env.EMAIL_FROM ?? "",
        password: process.env.EMAIL_PASSWORD ?? "",
        to: process.env.EMAIL_TO ?? "",
    };
}

export function isEmailConfigured(): boolean {
    const { from, password, to } = getEmailConfig();
    return Boolean(from && password && to);
}
