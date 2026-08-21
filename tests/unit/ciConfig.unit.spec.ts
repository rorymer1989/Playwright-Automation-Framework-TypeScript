import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const root = path.resolve(__dirname, "..", "..");
const playwrightVersion = (
    JSON.parse(fs.readFileSync(path.join(root, "node_modules/@playwright/test/package.json"), "utf8")) as {
        version: string;
    }
).version;

test.describe("CI configuration", () => {
    test("every Playwright Docker image in the workflow matches the installed @playwright/test", () => {
        const workflow = fs.readFileSync(path.join(root, ".github/workflows/playwright.yml"), "utf8");
        const images = [...workflow.matchAll(/mcr\.microsoft\.com\/playwright:v(\d+\.\d+\.\d+)/g)].map(
            (m) => m[1]
        );

        expect(images.length, "workflow should reference the Playwright image").toBeGreaterThan(0);
        for (const version of images) {
            expect(version, "bump the image tag together with @playwright/test").toBe(playwrightVersion);
        }
    });

    test("scripts/visual-docker.sh derives the image tag from the installed package", () => {
        const script = fs.readFileSync(path.join(root, "scripts/visual-docker.sh"), "utf8");
        expect(script).toContain("require('@playwright/test/package.json').version");
    });
});
