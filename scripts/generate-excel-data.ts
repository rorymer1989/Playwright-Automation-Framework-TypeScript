/**
 * Generates testData/<env>/checkout-customers.xlsx used by tests/shop/checkout-excel.spec.ts.
 * Re-run after editing the rows below:  npx tsx scripts/generate-excel-data.ts
 */
import path from "node:path";
import * as XLSX from "xlsx";

const rows = [
    {
        caseId: "CHK-01",
        executor: "Y",
        firstName: "Ana",
        lastName: "García",
        postalCode: "28001",
        product: "Sauce Labs Backpack",
    },
    {
        caseId: "CHK-02",
        executor: "Y",
        firstName: "Luis",
        lastName: "Pérez",
        postalCode: "08001",
        product: "Sauce Labs Bike Light",
    },
    {
        caseId: "CHK-03",
        executor: "N",
        firstName: "Skipped",
        lastName: "Row",
        postalCode: "00000",
        product: "Sauce Labs Onesie",
    },
    {
        caseId: "CHK-04",
        executor: "Y",
        firstName: "María",
        lastName: "López",
        postalCode: "41001",
        product: "Sauce Labs Onesie",
    },
];

for (const env of ["dev", "uat"]) {
    const file = path.resolve(__dirname, "..", "testData", env, "checkout-customers.xlsx");
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Customers");
    XLSX.writeFile(workbook, file);
    console.log(`✅ ${file}`);
}
