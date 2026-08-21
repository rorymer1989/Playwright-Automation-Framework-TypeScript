import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as XLSX from "xlsx";
import { test, expect } from "@playwright/test";
import { getTestData, writeCell, writePolicyNumber } from "../../utilities/excelUtil";

const SHEET = "Cases";

function createWorkbook(filePath: string): void {
    const rows = [
        { id: "TC1", executor: "Y", policyNumber: "" },
        { id: "TC2", executor: "n", policyNumber: "" },
        { id: "TC3", executor: "y", policyNumber: "" },
        { id: "TC4", policyNumber: "" },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), SHEET);
    XLSX.writeFile(wb, filePath);
}

test.describe("excelUtil", () => {
    let dir: string;
    let file: string;

    test.beforeEach(() => {
        dir = fs.mkdtempSync(path.join(os.tmpdir(), "excel-"));
        file = path.join(dir, "data.xlsx");
        createWorkbook(file);
    });

    test.afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

    test("getTestData returns only rows flagged executor=Y (case-insensitive) with their original index", () => {
        const rows = getTestData(file, SHEET);
        expect(rows.map((r) => r.id)).toEqual(["TC1", "TC3"]);
        expect(rows.map((r) => r.originalIndex)).toEqual([0, 2]);
    });

    test("getTestData supports a custom executor column", () => {
        expect(getTestData(file, SHEET, "id")).toHaveLength(0);
    });

    test("getTestData throws when the sheet does not exist", () => {
        expect(() => getTestData(file, "Nope")).toThrow(/Sheet "Nope" not found/);
    });

    test("writeCell persists a value in the given row and column", () => {
        writeCell(file, SHEET, 2, "policyNumber", "POL-123");
        const sheet = XLSX.readFile(file).Sheets[SHEET];
        const rows = XLSX.utils.sheet_to_json<{ id: string; policyNumber: string }>(sheet);
        expect(rows[2]).toMatchObject({ id: "TC3", policyNumber: "POL-123" });
        expect(rows[0].policyNumber).toBeFalsy();
    });

    test("writePolicyNumber targets the policyNumber column", () => {
        writePolicyNumber(file, SHEET, 0, 42);
        const rows = XLSX.utils.sheet_to_json<{ policyNumber: number }>(XLSX.readFile(file).Sheets[SHEET]);
        expect(rows[0].policyNumber).toBe(42);
    });

    test("writeCell rejects out-of-range rows", () => {
        expect(() => writeCell(file, SHEET, 99, "policyNumber", "x")).toThrow(/Row 99 not found/);
        expect(() => writeCell(file, SHEET, -1, "policyNumber", "x")).toThrow(/Row -1 not found/);
    });
});
