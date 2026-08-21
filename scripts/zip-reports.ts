import { logger } from "../utilities/logger";
import { zipExecutionReports } from "../reporting/zip/zipReport";

zipExecutionReports()
    .then((archives) => logger.info(`📦 ${archives.length} archive(s) created under reports/`))
    .catch((error: unknown) => {
        logger.error("Unable to zip reports:", error instanceof Error ? error.message : error);
        process.exit(1);
    });
