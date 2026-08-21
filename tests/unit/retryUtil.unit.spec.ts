import { test, expect } from "@playwright/test";
import { retry } from "../../utilities/retryUtil";

test.describe("retryUtil", () => {
    test("returns on first success without retrying", async () => {
        let calls = 0;
        await retry(
            () => {
                calls++;
                return Promise.resolve();
            },
            { retries: 3, delay: 0, logRetries: false }
        );
        expect(calls).toBe(1);
    });

    test("retries until the action succeeds", async () => {
        let calls = 0;
        await retry(
            () => {
                calls++;
                return calls < 3 ? Promise.reject(new Error("not yet")) : Promise.resolve();
            },
            { retries: 5, delay: 0, logRetries: false }
        );
        expect(calls).toBe(3);
    });

    test("gives up after `retries` attempts and reports the last error", async () => {
        let calls = 0;
        await expect(
            retry(
                () => {
                    calls++;
                    return Promise.reject(new Error(`boom ${calls}`));
                },
                { retries: 3, delay: 0, actionName: "Flaky op", logRetries: false }
            )
        ).rejects.toThrow(/Flaky op failed after 3 attempts\.\nboom 3/);
        expect(calls).toBe(3);
    });

    test("waits `delay` ms between attempts", async () => {
        const started = Date.now();
        await retry(
            () => (Date.now() - started < 100 ? Promise.reject(new Error("too early")) : Promise.resolve()),
            { retries: 10, delay: 40, logRetries: false }
        );
        expect(Date.now() - started).toBeGreaterThanOrEqual(100);
    });
});
