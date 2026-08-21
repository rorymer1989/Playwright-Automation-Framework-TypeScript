/**
 * Minimal leveled logger for framework output (setup, teardown, reporting, utilities).
 * Level comes from LOG_LEVEL (silent | error | warn | info | debug); default "info".
 * Test-level narration should use `test.step()` instead — it lands in the HTML/Allure
 * report and trace rather than in stdout.
 */
export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

const LEVELS: Record<LogLevel, number> = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };

function currentLevel(): number {
    const raw = (process.env.LOG_LEVEL ?? "info").toLowerCase() as LogLevel;
    return LEVELS[raw] ?? LEVELS.info;
}

function enabled(level: LogLevel): boolean {
    return currentLevel() >= LEVELS[level];
}

export const logger = {
    error(message: string, ...rest: unknown[]): void {
        if (enabled("error")) console.error(`❌ ${message}`, ...rest);
    },
    warn(message: string, ...rest: unknown[]): void {
        if (enabled("warn")) console.warn(`⚠️  ${message}`, ...rest);
    },
    info(message: string, ...rest: unknown[]): void {
        if (enabled("info")) console.log(message, ...rest);
    },
    debug(message: string, ...rest: unknown[]): void {
        if (enabled("debug")) console.log(`· ${message}`, ...rest);
    },
    /** Framed section header, info level. */
    section(title: string): void {
        if (enabled("info"))
            console.log(
                `\n========================================\n${title}\n========================================`
            );
    },
};
