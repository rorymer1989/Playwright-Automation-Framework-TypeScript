import { logger } from "../utilities/logger";
import { loadEnvironment } from "../config/environment";
import { sendExecutionReport } from "../reporting/email/emailUtil";

loadEnvironment();

sendExecutionReport().catch((error: unknown) => {
    logger.error("Unable to send execution email:", error instanceof Error ? error.message : error);
    process.exit(1);
});
