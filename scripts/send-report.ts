import { loadEnvironment } from "../config/environment";
import { sendExecutionReport } from "../reporting/email/emailUtil";

loadEnvironment();

sendExecutionReport().catch((error: unknown) => {
    console.error("❌ Unable to send execution email");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
