import { logger } from "./logger";
import fs from "node:fs";
import path from "node:path";

/**
 * Environment-aware JSON test data loader: <baseDir>/<TEST_ENV>/<fileName>.json.
 * Files are parsed once and cached per instance.
 */
export class DataManager {
    private cache = new Map<string, unknown>();

    constructor(private readonly baseDir: string = path.join(process.cwd(), "testData")) {}

    getEnvironment(): string {
        return process.env.TEST_ENV ?? "uat";
    }

    resolve(fileName: string): string {
        return path.join(this.baseDir, this.getEnvironment(), `${fileName}.json`);
    }

    load<T = Record<string, unknown>>(fileName: string): T {
        const filePath = this.resolve(fileName);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Data file not found: ${filePath}`);
        }

        if (!this.cache.has(filePath)) {
            logger.debug(`Loading test data: ${filePath}`);
            this.cache.set(filePath, JSON.parse(fs.readFileSync(filePath, "utf8")));
        }

        return this.cache.get(filePath) as T;
    }

    clearCache(): void {
        this.cache.clear();
    }
}

const dataManager = new DataManager();
export default dataManager;
