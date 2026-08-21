import { Locator, Page, expect } from "@playwright/test";
import { retry } from "./retryUtil";

export class ActionUtility {
  private static readonly DEFAULT_RETRIES = 3;
  private static readonly DEFAULT_TIMEOUT = 10000;

  /**
   * Generic retry wrapper (delegates to utilities/retryUtil)
   */
  static async retry<T>(
    action: () => Promise<T>,
    retries: number = this.DEFAULT_RETRIES,
    delay: number = 1000
  ): Promise<T> {
    let result!: T;
    await retry(async () => { result = await action(); }, { retries, delay, actionName: "ActionUtility" });
    return result;
  }

  /**
   * Static wait
   */
  static async wait(milliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * Wait for page load
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState("networkidle");
  }

  /**
   * Click
   */
  static async click(locator: Locator): Promise<void> {
    await this.retry(async () => {
      await locator.waitFor({
        state: "visible",
        timeout: this.DEFAULT_TIMEOUT,
      });

      await locator.click();
    });
  }

  /**
   * Force Click
   */
  static async forceClick(locator: Locator): Promise<void> {
    await locator.click({ force: true });
  }

  /**
   * Fill
   */
  static async fill(locator: Locator, value: string): Promise<void> {
    await this.retry(async () => {
      await locator.waitFor({
        state: "visible",
        timeout: this.DEFAULT_TIMEOUT,
      });

      await locator.fill(value);
    });
  }

  /**
   * Clear + Fill
   */
  static async clearAndFill(
    locator: Locator,
    value: string
  ): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Select Dropdown
   */
  static async selectByValue(
    locator: Locator,
    value: string
  ): Promise<void> {
    await locator.selectOption(value);
  }

  /**
   * Check Checkbox
   */
  static async check(locator: Locator): Promise<void> {
    if (!(await locator.isChecked())) {
      await locator.check();
    }
  }

  /**
   * Uncheck Checkbox
   */
  static async uncheck(locator: Locator): Promise<void> {
    if (await locator.isChecked()) {
      await locator.uncheck();
    }
  }

  /**
   * Hover
   */
  static async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Double Click
   */
  static async doubleClick(locator: Locator): Promise<void> {
    await locator.dblclick();
  }

  /**
   * Right Click
   */
  static async rightClick(locator: Locator): Promise<void> {
    await locator.click({
      button: "right",
    });
  }

  /**
   * Upload File
   */
  static async uploadFile(
    locator: Locator,
    filePath: string
  ): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  /**
   * Press Key
   */
  static async pressKey(
    locator: Locator,
    key: string
  ): Promise<void> {
    await locator.press(key);
  }

  /**
   * Scroll Into View
   */
  static async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait Until Visible
   */
  static async waitForVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({
      timeout: this.DEFAULT_TIMEOUT,
    });
  }

  /**
   * Wait Until Hidden
   */
  static async waitForHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden({
      timeout: this.DEFAULT_TIMEOUT,
    });
  }

  /**
   * Wait Until Enabled
   */
  static async waitForEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled({
      timeout: this.DEFAULT_TIMEOUT,
    });
  }

  /**
   * Wait Until Disabled
   */
  static async waitForDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled({
      timeout: this.DEFAULT_TIMEOUT,
    });
  }
}