import { test, expect } from "@playwright/test";
import { logger } from "../../utilities/logger";

function capture(run: () => void): string[] {
    const lines: string[] = [];
    const original = { log: console.log, warn: console.warn, error: console.error };
    const push = (...args: unknown[]) => {
        lines.push(args.map(String).join(" "));
    };
    console.log = push;
    console.warn = push;
    console.error = push;
    try {
        run();
    } finally {
        Object.assign(console, original);
    }
    return lines;
}

test.describe("logger", () => {
    const originalLevel = process.env.LOG_LEVEL;

    test.afterEach(() => {
        if (originalLevel === undefined) delete process.env.LOG_LEVEL;
        else process.env.LOG_LEVEL = originalLevel;
    });

    test("defaults to info: debug is hidden, info/warn/error shown", () => {
        delete process.env.LOG_LEVEL;
        const lines = capture(() => {
            logger.debug("d");
            logger.info("i");
            logger.warn("w");
            logger.error("e");
        });
        expect(lines).toEqual(["i", "⚠️  w", "❌ e"]);
    });

    test("LOG_LEVEL=warn hides info", () => {
        process.env.LOG_LEVEL = "warn";
        const lines = capture(() => {
            logger.info("i");
            logger.section("s");
            logger.warn("w");
        });
        expect(lines).toEqual(["⚠️  w"]);
    });

    test("LOG_LEVEL=silent hides everything", () => {
        process.env.LOG_LEVEL = "silent";
        expect(capture(() => logger.error("e"))).toEqual([]);
    });

    test("unknown level falls back to info", () => {
        process.env.LOG_LEVEL = "verbose";
        expect(capture(() => logger.debug("d"))).toEqual([]);
        expect(capture(() => logger.info("i"))).toEqual(["i"]);
    });
});
