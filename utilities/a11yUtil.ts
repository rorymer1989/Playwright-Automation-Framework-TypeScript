import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

export type AxeTag = "wcag2a" | "wcag2aa" | "wcag21a" | "wcag21aa" | "wcag22aa" | "best-practice";

export interface A11yOptions {
    /** WCAG tags to run. Default: WCAG 2.1 A + AA. */
    tags?: AxeTag[];
    /** Restrict the scan to a CSS selector (e.g. a dialog). */
    include?: string;
    /** CSS selectors to exclude (third-party widgets, known issues tracked elsewhere). */
    exclude?: string[];
    /** Rule ids to disable, with a reason in the test. */
    disableRules?: string[];
}

export interface A11yViolation {
    id: string;
    impact: string | null | undefined;
    help: string;
    helpUrl: string;
    nodes: string[];
}

/** Runs axe-core against the current page and returns the violations (does not assert). */
export async function scanA11y(page: Page, options: A11yOptions = {}): Promise<A11yViolation[]> {
    let builder = new AxeBuilder({ page }).withTags(
        options.tags ?? ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
    );
    if (options.include) builder = builder.include(options.include);
    for (const selector of options.exclude ?? []) builder = builder.exclude(selector);
    if (options.disableRules?.length) builder = builder.disableRules(options.disableRules);

    const results = await builder.analyze();
    return results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((n) => n.target.join(" ")),
    }));
}

function formatViolations(violations: A11yViolation[]): string {
    return violations
        .map(
            (v) =>
                `• [${v.impact ?? "n/a"}] ${v.id}: ${v.help}\n    ${v.helpUrl}\n    ${v.nodes.slice(0, 5).join("\n    ")}`
        )
        .join("\n");
}

/**
 * Scans the page and fails the test if there are violations. The full axe
 * result is attached to the report as JSON for triage.
 */
export async function expectNoA11yViolations(
    page: Page,
    options: A11yOptions = {},
    testInfo: TestInfo = test.info()
): Promise<void> {
    await test.step(
        `Accessibility scan (${(options.tags ?? ["wcag21aa"]).join(", ")})`,
        async () => {
            const violations = await scanA11y(page, options);
            await testInfo.attach("a11y-violations.json", {
                body: JSON.stringify(violations, null, 2),
                contentType: "application/json",
            });
            expect(violations, `Accessibility violations found:\n${formatViolations(violations)}`).toEqual(
                []
            );
        },
        { box: true }
    );
}
