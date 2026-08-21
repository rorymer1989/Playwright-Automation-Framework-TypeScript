import * as XLSX from "xlsx";

export type ExcelRow = Record<string, unknown>;

export interface IndexedRow extends ExcelRow {
    /** Zero-based row index in the sheet (header excluded). */
    originalIndex: number;
}

function readSheet(filePath: string, sheetName: string): { workbook: XLSX.WorkBook; rows: ExcelRow[] } {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);
    }
    return { workbook, rows: XLSX.utils.sheet_to_json<ExcelRow>(sheet) };
}

/**
 * Reads a sheet and returns the rows flagged for execution
 * (column `executor` === "Y", case-insensitive), each with its original index.
 */
export function getTestData(filePath: string, sheetName: string, executorColumn = "executor"): IndexedRow[] {
    const { rows } = readSheet(filePath, sheetName);
    return rows
        .map((row, originalIndex): IndexedRow => ({ ...row, originalIndex }))
        .filter((row) => String(row[executorColumn] ?? "").toUpperCase() === "Y");
}

/** Writes `value` into `column` of the given row (zero-based) and saves the workbook. */
export function writeCell(filePath: string, sheetName: string, rowIndex: number, column: string, value: unknown): void {
    const { workbook, rows } = readSheet(filePath, sheetName);

    if (!Number.isInteger(rowIndex) || rowIndex < 0 || rowIndex >= rows.length) {
        throw new Error(`Row ${rowIndex} not found in ${filePath} (${rows.length} rows)`);
    }

    rows[rowIndex][column] = value;
    workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(rows);
    XLSX.writeFile(workbook, filePath);
}

/** Backwards-compatible helper for the legacy `policyNumber` column. */
export function writePolicyNumber(filePath: string, sheetName: string, rowIndex: number, policyNumber: string | number): void {
    writeCell(filePath, sheetName, rowIndex, "policyNumber", policyNumber);
}
