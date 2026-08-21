import { expect, test, type Locator, type Page } from "@playwright/test";

export interface VisualOptions {
    /** Max differing pixels as a ratio of the total (0–1). Default 0.01. */
    maxDiffPixelRatio?: number;
    /** Elements whose content changes between runs (dates, ads, carousels). */
    mask?: Locator[];
    fullPage?: boolean;
    /** Hide animations/carets before the capture. Default true. */
    stable?: boolean;
}

/**
 * Visual regression check. Baselines live next to the spec in
 * `<spec>-snapshots/<name>-<project>-<platform>.png`; create/refresh them with
 * `npm run test:visual:update`. Because the project name is part of the
 * filename, each browser keeps its own baseline.
 */
export async function expectVisualMatch(
    target: Page | Locator,
    name: string,
    { maxDiffPixelRatio = 0.01, mask, fullPage = false, stable = true }: VisualOptions = {}
): Promise<void> {
    await test.step(
        `Visual match: ${name}`,
        async () => {
            const options = {
                maxDiffPixelRatio,
                mask,
                animations: stable ? ("disabled" as const) : ("allow" as const),
                caret: stable ? ("hide" as const) : ("initial" as const),
            };
            if ("goto" in target) {
                await expect(target).toHaveScreenshot(`${name}.png`, { ...options, fullPage });
            } else {
                await expect(target).toHaveScreenshot(`${name}.png`, options);
            }
        },
        { box: true }
    );
}
