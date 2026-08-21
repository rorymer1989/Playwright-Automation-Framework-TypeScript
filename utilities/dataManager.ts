import fs from "node:fs";
import path from "node:path";

class DataManager {
    private cache: Record<string, unknown> = {};

    getEnvironment(): string {
        return process.env.TEST_ENV ?? "uat";
    }

    load<T = Record<string, unknown>>(fileName: string): T {
        const filePath = path.join(process.cwd(), "testData", this.getEnvironment(), `${fileName}.json`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Data file not found: ${filePath}`);
        }

        if (!this.cache[filePath]) {
            console.log(`Loading Test Data: ${filePath}`);
            this.cache[filePath] = JSON.parse(fs.readFileSync(filePath, "utf8"));
        }

        return this.cache[filePath] as T;
    }

    clearCache(): void {
        this.cache = {};
    }
}

const dataManager = new DataManager();
export default dataManager;
