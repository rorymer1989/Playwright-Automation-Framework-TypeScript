/**
 * Compatibility barrel. Prefer importing from the focused modules:
 *   screenshotUtil, excelUtil, fileUtil, scrollUtil
 */
export { takeScreenshot, getCurrentDate } from "./screenshotUtil";
export { getTestData, getTestData as getTestdata, writeCell, writePolicyNumber } from "./excelUtil";
export { createFolder, downloadFile } from "./fileUtil";
export { clickWithScroll } from "./scrollUtil";
