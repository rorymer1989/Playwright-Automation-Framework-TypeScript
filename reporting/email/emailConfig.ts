export const emailConfig = {
    service: process.env.EMAIL_SERVICE ?? "gmail",
    from: process.env.EMAIL_FROM ?? "",
    password: process.env.EMAIL_PASSWORD ?? "",
    to: process.env.EMAIL_TO ?? "",
};

export function isEmailConfigured(): boolean {
    return Boolean(emailConfig.from && emailConfig.password && emailConfig.to);
}
