import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { DataManager } from "../../utilities/dataManager";

test.describe("dataManager", () => {
    let baseDir: string;
    const originalEnv = process.env.TEST_ENV;

    test.beforeEach(() => {
        baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "testdata-"));
        fs.mkdirSync(path.join(baseDir, "dev"));
        fs.mkdirSync(path.join(baseDir, "uat"));
        fs.writeFileSync(path.join(baseDir, "dev", "users.json"), JSON.stringify({ env: "dev" }));
        fs.writeFileSync(path.join(baseDir, "uat", "users.json"), JSON.stringify({ env: "uat" }));
    });

    test.afterEach(() => {
        fs.rmSync(baseDir, { recursive: true, force: true });
        if (originalEnv === undefined) delete process.env.TEST_ENV;
        else process.env.TEST_ENV = originalEnv;
    });

    test("loads the file for the current TEST_ENV", () => {
        process.env.TEST_ENV = "dev";
        expect(new DataManager(baseDir).load<{ env: string }>("users").env).toBe("dev");
        process.env.TEST_ENV = "uat";
        expect(new DataManager(baseDir).load<{ env: string }>("users").env).toBe("uat");
    });

    test("defaults to uat when TEST_ENV is unset", () => {
        delete process.env.TEST_ENV;
        expect(new DataManager(baseDir).getEnvironment()).toBe("uat");
    });

    test("throws a descriptive error when the file is missing", () => {
        process.env.TEST_ENV = "dev";
        expect(() => new DataManager(baseDir).load("missing")).toThrow(
            /Data file not found: .*dev[/\\]missing\.json/
        );
    });

    test("caches parsed files until clearCache()", () => {
        process.env.TEST_ENV = "dev";
        const dm = new DataManager(baseDir);
        const first = dm.load<{ env: string }>("users");

        fs.writeFileSync(path.join(baseDir, "dev", "users.json"), JSON.stringify({ env: "changed" }));
        expect(dm.load<{ env: string }>("users")).toBe(first); // same object, from cache

        dm.clearCache();
        expect(dm.load<{ env: string }>("users").env).toBe("changed");
    });
});
