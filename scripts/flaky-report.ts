import fs from "node:fs";
import { evaluateFlakyPolicy, formatFlakyMarkdown } from "../reporting/flaky/flakyReport";
import { logger } from "../utilities/logger";

/**
 * Flaky policy gate. Reads test-result.json (merged in CI, local JSON reporter otherwise),
 * lists every test that passed only after a retry and fails when the count exceeds
 * FLAKY_BUDGET (default 0). Appends the table to the GitHub job summary when available.
 *
 *   npm run report:flaky
 *   FLAKY_BUDGET=2 npm run report:flaky
 */
const result = evaluateFlakyPolicy(process.argv[2]);
const markdown = formatFlakyMarkdown(result);

logger.info(markdown);
if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
}

if (result.exceeded) {
    logger.error(`Flaky budget exceeded: ${result.flaky.length} > ${result.budget}`);
    process.exit(1);
}
