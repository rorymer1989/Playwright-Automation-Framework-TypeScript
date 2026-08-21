import { EXECUTION_CONFIG } from "../../config/executionConfig";

export const DEFAULT_ALLURE_METADATA = {
    owner: EXECUTION_CONFIG.author,
    severity: "critical",
    epic: "Playwright Automation",
    framework: EXECUTION_CONFIG.frameworkName,
} as const;
