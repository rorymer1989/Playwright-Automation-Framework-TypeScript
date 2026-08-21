import { zipExecutionReports } from "../reporting/zip/zipReport";

zipExecutionReports()
    .then((archives) => console.log(`📦 ${archives.length} archive(s) created under reports/`))
    .catch((error: unknown) => {
        console.error("❌ Unable to zip reports:", error instanceof Error ? error.message : error);
        process.exit(1);
    });
