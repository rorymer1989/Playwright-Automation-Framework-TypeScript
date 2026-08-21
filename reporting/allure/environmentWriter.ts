import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export function writeEnvironment(): void {

    const reportFolder = path.join(process.cwd(), "allure-results");

    if (!fs.existsSync(reportFolder)) {

        fs.mkdirSync(reportFolder, {
            recursive: true
        });

    }

    let browser = "Chromium";

    if (process.env.BROWSER)
        browser = process.env.BROWSER;

    const content =

`Framework=Playwright Automation Framework
Framework Version=v1.2.0
Environment=${process.env.TEST_ENV || "UAT"}
Browser=${browser}
Execution=Parallel
Node Version=${process.version}
Operating System=${os.type()} ${os.release()}
Base URL=${process.env.BASE_URL}
Execution Date=${new Date().toLocaleString()}
`;

    fs.writeFileSync(

        path.join(reportFolder, "environment.properties"),

        content

    );

    console.log("✅ Allure Environment Information Generated");

}

