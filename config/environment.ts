import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

export type TestEnvironment = "dev" | "uat" | "pre-prod" | "prod";

/**
 * Loads environment variables into process.env, never overriding values already
 * set in the shell / CI. Order:
 *   1. <repo>/.env              — local secrets (email creds, etc.). Git-ignored, optional.
 *   2. config/environments/<TEST_ENV>.env — per-environment, non-secret values (BASE_URL). Committed.
 * TEST_ENV defaults to "uat".
 */
export function loadEnvironment(): TestEnvironment {
    const rootEnv = path.resolve(__dirname, "..", ".env");
    if (fs.existsSync(rootEnv)) {
        dotenv.config({ path: rootEnv });
    }

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
