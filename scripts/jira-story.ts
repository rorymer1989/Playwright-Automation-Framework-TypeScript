/**
 * Prints a Jira story as Markdown, ready to feed the test generator.
 *   npx tsx scripts/jira-story.ts SCRUM-12            # markdown
 *   npx tsx scripts/jira-story.ts SCRUM-12 --json     # raw JiraStory
 */
import { loadEnvironment } from "../config/environment";
import { JiraClient, storyToMarkdown } from "../utilities/jiraClient";
import { logger } from "../utilities/logger";

loadEnvironment();

const [key, ...flags] = process.argv.slice(2);
if (!key) {
    logger.error("Usage: npx tsx scripts/jira-story.ts <ISSUE-KEY> [--json]");
    process.exit(2);
}

new JiraClient()
    .getStory(key)
    .then((story) => {
        console.log(flags.includes("--json") ? JSON.stringify(story, null, 2) : storyToMarkdown(story));
    })
    .catch((error: unknown) => {
        logger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    });
