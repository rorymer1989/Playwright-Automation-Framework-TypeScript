const fileSystem = require("fs");
const pathModule = require("path");
const archiver = require("archiver");

async function zipDirectory(sourceDir: string, outputZip: string): Promise<void> {

    return new Promise<void>((resolve, reject: (reason?: unknown) => void) => {

        const output = fileSystem.createWriteStream(outputZip);

        const archive = archiver("zip", {

            zlib: {

                level: 9

            }

        });

        output.on("close", () => {

            console.log(`✅ Created ${outputZip}`);

            resolve();

        });

        archive.on("error", reject);

        archive.pipe(output);

        archive.directory(sourceDir, false);

        archive.finalize();

    });

}

async function createExecutionReportArchives() {

    const reportsFolder = pathModule.join(process.cwd(), "reports");

    if (!fileSystem.existsSync(reportsFolder)) {

        fileSystem.mkdirSync(reportsFolder);

    }

    if (fileSystem.existsSync("playwright-report")) {

        await zipDirectory(

            "playwright-report",

            "reports/playwright-report.zip"

        );

    }

    if (fileSystem.existsSync("allure-report")) {

        await zipDirectory(

            "allure-report",

            "reports/allure-report.zip"

        );

    }

}

module.exports = {

    zipExecutionReports: createExecutionReportArchives

};