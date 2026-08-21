import { logger } from "./logger";

/**
 * Generic retry utility
 */

interface RetryOptions {
    retries?: number;
    delay?: number;
    actionName?: string;
    logRetries?: boolean;
}

export async function retry(
    action: () => Promise<void>,
    { retries = 3, delay = 1000, actionName = "Action", logRetries = true }: RetryOptions = {}
): Promise<void> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await action();
        } catch (error) {
            lastError = error;

            if (logRetries) {
                logger.warn(`${actionName} failed. Retry ${attempt}/${retries}`);
            }

            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    throw new Error(
        `${actionName} failed after ${retries} attempts.\n${
            lastError instanceof Error ? lastError.message : String(lastError)
        }`
    );
}
