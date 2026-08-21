import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

export type TestEnvironment = "dev" | "uat" | "pre-prod" | "prod";

/**
 * Loads config/environments/<TEST_ENV>.env into process.env (without overriding
 * variables already set in the shell / CI). Defaults to "uat".
 */
export function loadEnvironment(): TestEnvironment {
    const env = (process.env.TEST_ENV ?? "uat").toLowerCase() as TestEnvironment;
    const envFile = path.resolve(__dirname, "environments", `${env}.env`);

    if (!fs.existsSync(envFile)) {
        throw new Error(`Environment file not found: ${envFile} (TEST_ENV="${env}")`);
    }

    dotenv.config({ path: envFile });
    process.env.TEST_ENV = env;
    return env;
}

export const ENV = {
    get baseUrl(): string {
        return process.env.BASE_URL ?? "";
    },
    get environment(): string {
        return process.env.TEST_ENV ?? "uat";
    },
};
